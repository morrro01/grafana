---
aliases:
  - ../../provision-alerting-resources/terraform-provisioning/
canonical: https://grafana.com/docs/grafana/latest/alerting/set-up/provision-alerting-resources/terraform-provisioning/
description: Create and manage alerting resources using Terraform
keywords:
  - grafana
  - alerting
  - alerting resources
  - provisioning
  - Terraform
labels:
  products:
    - cloud
    - enterprise
    - oss
menuTitle: Use Terraform to provision
title: Use Terraform to provision alerting resources
weight: 200
---

# Use Terraform to provision alerting resources

Use Terraform’s Grafana Provider to manage your alerting resources and provision them into your Grafana system. Terraform provider support for Grafana Alerting makes it easy to create, manage, and maintain your entire Grafana Alerting stack as code.

This guide outlines the steps and references to provision alerting resources with Terraform. For a practical demo, you can clone and try this [example using Grafana OSS and Docker Compose](https://github.com/grafana/provisioning-alerting-examples/tree/main/terraform).

To create and manage your alerting resources using Terraform, you have to complete the following tasks.

1. Create an API key to configure the Terraform provider.
1. Create your alerting resources in Terraform format by
   - [exporting configured alerting resources][alerting_export]
   - or writing the [Terraform Alerting schemas](https://registry.terraform.io/providers/grafana/grafana/latest/docs).
     > By default, you cannot edit provisioned resources. Enable [`disable_provenance` in the Terraform resource](#edit-provisioned-resources-in-the-grafana-ui) to allow changes in the Grafana UI.
1. Run `terraform apply` to provision your alerting resources.

Before you begin, you should have available a Grafana instance and [Terraform installed](https://www.terraform.io/downloads) on your machine.

## Create an API key and configure the Terraform provider

You can create a [service account token][service-accounts] to authenticate Terraform with Grafana. To create an API key for provisioning alerting resources, complete the following steps.

1. Create a new service account.
1. Assign the role or permission to access the [Alerting provisioning API][alerting_http_provisioning].
1. Create a new service account token.
1. Name and save the token for use in Terraform.

You can now move to the working directory for your Terraform configurations, and create a file named `main.tf` like:

```main.tf
terraform {
    required_providers {
        grafana = {
            source = "grafana/grafana"
            version = ">= 2.9.0"
        }
    }
}

provider "grafana" {
    url = <grafana-url>
    auth = <api-key>
}
```

Replace the following values:

- `<grafana-url>` with the URL of the Grafana instance.
- `<api-key>` with the API token previously created.

This Terraform configuration installs the [Grafana Terraform provider](https://registry.terraform.io/providers/grafana/grafana/latest/docs) and authenticates against your Grafana instance using an API token. For other authentication alternatives including basic authentication, refer to the [`auth` option documentation](https://registry.terraform.io/providers/grafana/grafana/latest/docs#authentication).

For Grafana Cloud, refer to the [instructions to manage a Grafana Cloud stack with Terraform][provision-cloud-with-terraform]. For Role-based access control, refer to [Provisioning RBAC with Terraform](rbac-terraform-provisioning) and the [alerting provisioning roles (`fixed:alerting.provisioning.*`)][rbac-role-definitions].

## Create Terraform configurations for alerting resources

With the [Grafana Terraform provider](https://registry.terraform.io/providers/grafana/grafana/latest/docs), you can manage the following alerting resources.

| Alerting resource                               | Terraform resource                                                                                                               |
| ----------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| [Alert rules][alerting-rules]                   | [grafana_rule_group](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/rule_group)                   |
| [Contact points][contact-points]                | [grafana_contact_point](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/contact_point)             |
| [Notification templates][notification-template] | [grafana_message_template](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/message_template)       |
| [Notification policy tree][notification-policy] | [grafana_notification_policy](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/notification_policy) |
| [Mute timings][mute-timings]                    | [grafana_mute_timing](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/mute_timing)                 |

### Add alert rules

[Alert rules][alerting-rules] enable you to alert against any Grafana data source. This can be a data source that you already have configured, or you can [define your data sources in Terraform](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/data_source) alongside your alert rules.

To provision alert rules, refer to the [grafana_rule_group schema](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/rule_group), and complete the following steps.

1. Create a data source to query and a folder to store your rules in.

   In this example, the [TestData][testdata] data source is used.

   Alerts can be defined against any backend datasource in Grafana.

   ```HCL
   resource "grafana_data_source" "testdata_datasource" {
       name = "TestData"
       type = "testdata"
   }

   resource "grafana_folder" "rule_folder" {
       title = "My Rule Folder"
   }
   ```

1. Define an alert rule.

   For more information on alert rules, refer to [how to create Grafana-managed alerts](/blog/2022/08/01/grafana-alerting-video-how-to-create-alerts-in-grafana-9/).

1. Create a rule group containing one or more rules.

   In this example, the `grafana_rule_group` resource group is used.

   ```HCL
   resource "grafana_rule_group" "my_rule_group" {
       name = "My Alert Rules"
       folder_uid = grafana_folder.rule_folder.uid
       interval_seconds = 60
       org_id = 1

       rule {
           name = "My Random Walk Alert"
           condition = "C"
           for = "0s"

           // Query the datasource.
           data {
               ref_id = "A"
               relative_time_range {
                   from = 600
                   to = 0
               }
               datasource_uid = grafana_data_source.testdata_datasource.uid
               // `model` is a JSON blob that sends datasource-specific data.
               // It's different for every datasource. The alert's query is defined here.
               model = jsonencode({
                   intervalMs = 1000
                   maxDataPoints = 43200
                   refId = "A"
               })
           }

           // The query was configured to obtain data from the last 60 seconds. Let's alert on the average value of that series using a Reduce stage.
           data {
               datasource_uid = "__expr__"
               // You can also create a rule in the UI, then GET that rule to obtain the JSON.
               // This can be helpful when using more complex reduce expressions.
               model = <<EOT
   {"conditions":[{"evaluator":{"params":[0,0],"type":"gt"},"operator":{"type":"and"},"query":{"params":["A"]},"reducer":{"params":[],"type":"last"},"type":"avg"}],"datasource":{"name":"Expression","type":"__expr__","uid":"__expr__"},"expression":"A","hide":false,"intervalMs":1000,"maxDataPoints":43200,"reducer":"last","refId":"B","type":"reduce"}
   EOT
               ref_id = "B"
               relative_time_range {
                   from = 0
                   to = 0
               }
           }

           // Now, let's use a math expression as our threshold.
           // We want to alert when the value of stage "B" above exceeds 70.
           data {
               datasource_uid = "__expr__"
               ref_id = "C"
               relative_time_range {
                   from = 0
                   to = 0
               }
               model = jsonencode({
                   expression = "$B > 70"
                   type = "math"
                   refId = "C"
               })
           }
       }
   }
   ```

1. Run the command `terraform apply`.
1. Go to the Grafana UI and check your alert rule.

You can see whether or not the alert rule is firing. You can also see a visualization of each of the alert rule’s query stages

When the alert fires, Grafana routes a notification through the policy you defined.

For example, if you chose Slack as a contact point, Grafana’s embedded [Alertmanager](https://github.com/prometheus/alertmanager) automatically posts a message to Slack.

### Add contact points

Contact points connect an alerting stack to the outside world. They tell Grafana how to connect to your external systems and where to deliver notifications.

To provision contact points and templates, refer to the [grafana_contact_point schema](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/contact_point) and [grafana_message_template schema](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/message_template), and complete the following steps.

1. Copy this code block into a `.tf` file on your local machine.

   This example creates a contact point that sends alert notifications to Slack.

   ```HCL
   resource "grafana_contact_point" "my_slack_contact_point" {
       name = "Send to My Slack Channel"

       slack {
           url = <YOUR_SLACK_WEBHOOK_URL>
           text = <<EOT
   {{ len .Alerts.Firing }} alerts are firing!

   Alert summaries:
   {{ range .Alerts.Firing }}
   {{ template "Alert Instance Template" . }}
   {{ end }}
   EOT
       }
   }
   ```

   You can create multiple external integrations in a single contact point. Notifications routed to this contact point will be sent to all integrations. This example shows multiple integrations in the same Terraform resource.

   ```
   resource "grafana_contact_point" "my_multi_contact_point" {
       name = "Send to Many Places"

       slack {
           url = "webhook1"
           ...
       }
       slack {
           url = "webhook2"
           ...
       }
       teams {
           ...
       }
       email {
           ...
       }
   }
   ```

1. Enter text for your notification in the text field.

   The `text` field supports [Go-style templating](https://pkg.go.dev/text/template). This enables you to manage your Grafana Alerting notification templates directly in Terraform.

1. Run the command `terraform apply`.

1. Go to the Grafana UI and check the details of your contact point.

1. Click **Test** to verify that the contact point works correctly.

### Add the notification policiy tree

Notification policies tell Grafana how to route alert instances to your contact points. They connect firing alerts to your previously defined contact points using a system of labels and matchers.

To provision notification policies and routing, refer to the [grafana_notification_policy schema](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/notification_policy), and complete the following steps.

{{% admonition type="warning" %}}

Since the policy tree is a single resource, provisioning the `grafana_notification_policy` resource will overwrite a policy tree created through any other means.

{{< /admonition >}}

1. Copy this code block into a `.tf` file on your local machine.

   In this example, the alerts are grouped by `alertname`, which means that any notifications coming from alerts which share the same name, are grouped into the same Slack message. You can provide any set of label keys here, or you can use the special label `"..."` to route by all label keys, sending each alert in a separate notification.

   If you want to route specific notifications differently, you can add sub-policies. Sub-policies allow you to apply routing to different alerts based on label matching. In this example, we apply a mute timing to all alerts with the label a=b.

   ```HCL
   resource "grafana_notification_policy" "my_policy" {
       group_by = ["alertname"]
       contact_point = grafana_contact_point.my_slack_contact_point.name

       group_wait = "45s"
       group_interval = "6m"
       repeat_interval = "3h"

       policy {
           matcher {
               label = "a"
               match = "="
               value = "b"
           }
           group_by = ["..."]
           contact_point = grafana_contact_point.a_different_contact_point.name
           mute_timings = [grafana_mute_timing.my_mute_timing.name]

           policy {
               matcher {
                   label = "sublabel"
                   match = "="
                   value = "subvalue"
               }
               contact_point = grafana_contact_point.a_third_contact_point.name
               group_by = ["..."]
           }
       }
   }
   ```

1. In the mute_timings field, link a mute timing to your notification policy.

1. Run the command `terraform apply`.

1. Go to the Grafana UI and check the details of your notification policy.

1. Click **Test** to verify that the notification point is working correctly.

### Add templates

You can reuse the same templates across many contact points. In the example above, a shared template ie embedded using the statement `{{ template “Alert Instance Template” . }}`

This fragment can then be managed separately in Terraform:

```HCL
resource "grafana_message_template" "my_alert_template" {
    name = "Alert Instance Template"

    template = <<EOT
{{ define "Alert Instance Template" }}
Firing: {{ .Labels.alertname }}
Silence: {{ .SilenceURL }}
{{ end }}
EOT
}
```

### Add mute timings

Mute timings provide the ability to mute alert notifications for defined time periods.

To provision mute timings, refer to the [grafana_mute_timing schema](https://registry.terraform.io/providers/grafana/grafana/latest/docs/resources/mute_timing), and complete the following steps.

1. Copy this code block into a `.tf` file on your local machine.

   In this example, alert notifications are muted on weekends.

   ```HCL
   resource "grafana_mute_timing" "my_mute_timing" {
       name = "My Mute Timing"

       intervals {
           times {
           start = "04:56"
           end = "14:17"
           }
           weekdays = ["saturday", "sunday", "tuesday:thursday"]
           months = ["january:march", "12"]
           years = ["2025:2027"]
       }
   }
   ```

1. Run the command `terraform apply`.
1. Go to the Grafana UI and check the details of your mute timing.
1. Reference your newly created mute timing in a notification policy using the `mute_timings` field.
   This will apply your mute timing to some or all of your notifications.

1. Click **Test** to verify that the mute timing is working correctly.

### Enable editing resources in the Grafana UI

By default, you cannot edit resources provisioned via Terraform in Grafana. This ensures that your alerting stack always stays in sync with your Terraform code.

To make provisioned resources editable in the Grafana UI, enable the `disable_provenance` attribute on alerting resources.

```terraform
resource "grafana_contact_point" "my_contact_point" {
  name = "My Contact Point"

  disable_provenance = true
}

resource "grafana_message_template" "my_template" {
  name     = "My Reusable Template"
  template = "{{define \"My Reusable Template\" }}\n template content\n{{ end }}"

  disable_provenance = true
}
...
```

## Provision Grafana resources with Terraform

To import the Grafana alerting resources previously created with the Terraform CLI, complete the following steps.

1. Initialize the working directory containing the Terraform configuration files.

   ```shell
   terraform init
   ```

   This command initializes the Terraform directory, installing the Grafana Terraform provider configured in the `main.tf` file.

1. Apply the Terraform configuration files to provision the resources.

   ```shell
   terraform apply
   ```

   Before applying any changes to Grafana, Terraform displays the execution plan and requests your approval.

   ```shell
    Plan: 4 to add, 0 to change, 0 to destroy.

    Do you want to perform these actions?
    Terraform will perform the actions described above.
    Only 'yes' will be accepted to approve.

    Enter a value:
   ```

   Once you have confirmed to proceed with the changes, Terraform will create the provisioned resources in Grafana!

   ```shell
   Apply complete! Resources: 4 added, 0 changed, 0 destroyed.
   ```

You can now access Grafana to verify the creation of the distinct resources.

## More examples

For more examples on the concept of this guide:

- Try the demo [provisioning alerting resources in Grafana OSS using Terraform and Docker Compose](https://github.com/grafana/provisioning-alerting-examples/tree/main/terraform).
- Review all the available options and examples of the Terraform Alerting schemas in the [Grafana Terraform Provider documentation](https://registry.terraform.io/providers/grafana/grafana/latest/docs).
- Review the [tutorial to manage a Grafana Cloud stack using Terraform][provision-cloud-with-terraform].

{{% docs/reference %}}

[alerting-rules]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/alerting/alerting-rules"
[alerting-rules]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/alerting-and-irm/alerting/alerting-rules"

[contact-points]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/alerting/configure-notifications/manage-contact-points"
[contact-points]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/alerting-and-irm/alerting/configure-notifications/manage-contact-points"

[mute-timings]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/alerting/configure-notifications/mute-timings"
[mute-timings]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/alerting-and-irm/alerting/configure-notifications/mute-timings"

[notification-policy]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/alerting/configure-notifications/create-notification-policy"
[notification-policy]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/alerting-and-irm/alerting/configure-notifications/create-notification-policy"

[notification-template]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/alerting/configure-notifications/template-notifications"
[notification-template]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/alerting-and-irm/alerting/configure-notifications/template-notifications"

[alerting_export]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/alerting/set-up/provision-alerting-resources/export-alerting-resources"
[alerting_export]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/alerting-and-irm/alerting/set-up/provision-alerting-resources/export-alerting-resources"

[alerting_http_provisioning]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/alerting/set-up/provision-alerting-resources/http-api-provisioning"
[alerting_http_provisioning]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/alerting-and-irm/alerting/set-up/provision-alerting-resources/http-api-provisioning"

[service-accounts]: "/docs/ -> /docs/grafana/<GRAFANA_VERSION>/administration/service-accounts"

[testdata]: "/docs/grafana/ -> /docs/grafana/<GRAFANA_VERSION>/datasources/testdata"
[testdata]: "/docs/grafana-cloud/ -> /docs/grafana-cloud/connect-externally-hosted/data-sources/testdata"

[provision-cloud-with-terraform]: "/docs/ -> /docs/grafana-cloud/developer-resources/infrastructure-as-code/terraform/terraform-cloud-stack"

[rbac-role-definitions]: "/docs/ -> /docs/grafana/<GRAFANA_VERSION>/administration/roles-and-permissions/access-control/rbac-fixed-basic-role-definitions"

[rbac-terraform-provisioning]: "/docs/ -> /docs/grafana/<GRAFANA_VERSION>/administration/roles-and-permissions/access-control/rbac-terraform-provisioning"

{{% /docs/reference %}}
