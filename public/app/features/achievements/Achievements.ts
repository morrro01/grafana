import { AchievementId, AchievementLevel } from './types';

// These are just hard coded for now loosely based on current available achievements
export const achievementLevelThresholds = {
  [AchievementLevel.Novice]: 3,
  [AchievementLevel.Beginner]: 9,
  [AchievementLevel.Experienced]: 16,
  [AchievementLevel.Expert]: 30,
  [AchievementLevel.Wizard]: 40,
};

export const achievements = [
  {
    id: AchievementId.NavigateToDashboard,
    title: 'Navigate to the dashboard page',
    description: 'Explore Grafana by navigating to a dashboard page',
    level: AchievementLevel.Novice,
    link: 'https://grafana.com/docs/grafana/latest/dashboards/use-dashboards/',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.NavigateToExplore,
    title: 'Navigate to the explore page',
    description: 'Learn all the Explore page in Grafana',
    level: AchievementLevel.Novice,
    link: 'https://grafana.com/docs/grafana/latest/explore/',
    video: '',
    icon: 'compass',
  },
  {
    id: AchievementId.WatchIntroToGrafanaVideo,
    title: 'Watch intro to Grafana video',
    description: 'This is a  great intro video about how to use Grafana. Enjoy!',
    level: AchievementLevel.Novice,
    link: '',
    video: 'https://www.youtube.com/embed/k3RQVyeYdO8?si=96JCRzMkuo6fjn4O',
    icon: 'grafana',
  },
  {
    id: AchievementId.ConnectYourFirstDatasource,
    title: 'Connect your first datasource',
    description: 'Connect your first datasource to Grafana',
    level: AchievementLevel.Beginner,
    link: 'https://grafana.com/docs/grafana/latest/administration/data-source-management/?utm_source=grafana_gettingstarted',
    video: '',
    icon: 'database',
  },
  {
    id: AchievementId.UseExploreToMakeAQuery,
    title: 'Use explore to make a query',
    description: 'Make a query in Explore and see the results in a table or graph',
    level: AchievementLevel.Beginner,
    link: 'https://grafana.com/docs/grafana/latest/explore/',
    video: '',
    icon: 'compass',
  },
  {
    id: AchievementId.AddExplorePanelToADashboard,
    title: 'Add explore panel to a dashboard',
    description: 'While on Explore page, add the panel to a dashboard',
    level: AchievementLevel.Beginner,
    link: 'https://grafana.com/docs/grafana/latest/explore/',
    video: '',
    icon: 'compass',
  },
  {
    id: AchievementId.AddATitleToAPanelInADashboard,
    title: 'Add a title to a panel in a dashboard',
    description: 'Navigate to a panel in a dashboard and add a title',
    level: AchievementLevel.Beginner,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-panel-options/#add-a-title-and-description-to-a-panel',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.AddADescriptionToAPanelInADashboard,
    title: 'Add a description to a panel in a dashboard',
    description: 'Navigate to a panel in a dashboard and add a description',
    level: AchievementLevel.Beginner,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-panel-options/#add-a-title-and-description-to-a-panel',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.ChangeTheTheme,
    title: 'Change the theme',
    description: 'Change the theme using the keyboard shortcut `ct`',
    level: AchievementLevel.Beginner,
    link: 'https://grafana.com/docs/grafana/latest/administration/organization-preferences/#change-grafana-ui-theme',
    video: '',
    icon: 'palette',
  },
  {
    id: AchievementId.ExploreKeyboardShortcuts,
    title: 'Explore keyboard shortcuts',
    description: 'Use the keyboard shortcut `?` or `h` to see a list of keyboard shortcuts',
    level: AchievementLevel.Experienced,
    link: '',
    video: '',
    icon: 'keyboard',
  },
  {
    id: AchievementId.ChangePanelSettings,
    title: 'Change panel settings',
    description: 'Modify the visualization type, change the unit, change the legend position etc',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-panel-options/',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.ImplementDataLink,
    title: 'Implement a data link',
    description: 'Create a data link that opens a new tab to a URL',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana-cloud/visualizations/panels-visualizations/configure-data-links/',
    video: '',
    icon: 'link',
  },
  {
    id: AchievementId.AddTemplateVariable,
    title: 'Add a template variable',
    description: 'Add a template variable to a dashboard',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/dashboards/variables/add-template-variables/',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.BrowseDataTransformations,
    title: 'Browse data transformations that you can add to your panel',
    description: '',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/query-transform-data/transform-data/',
    video: '',
    icon: 'process',
  },
  {
    id: AchievementId.AddCanvasVisualization,
    title: 'Add a Canvas visualization',
    description: 'Navigate to a Dashboard and add a Canvas visualization',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/canvas',
    video: '',
    icon: 'edit',
  },
  {
    id: AchievementId.SetMetricValueElement,
    title: 'Set a metric value element',
    description: 'Set a metric value element in a Canvas visualization',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/visualizations/canvas/#metric-value',
    video: '',
    icon: 'edit',
  },
  {
    id: AchievementId.EnableSharedCrosshairOrTooltip,
    title: 'Enable shared crosshair or tooltip in a dashboard',
    description: 'Navigate to Dashboard Settings and enable the Shared Crosshair or Shared Tooltip setting',
    level: AchievementLevel.Experienced,
    link: '',
    video: '',
    icon: 'crosshair',
  },
  {
    id: AchievementId.LegendChangeSeriesColor,
    title: 'Change a series color in the legend',
    description: 'Change color of series by clicking on time series legend',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-legend/#change-a-series-color',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.LegendShowSeries,
    title: 'Isolate series data in a visualization',
    description: 'Click on series in the legend to display it by itself',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-legend/#configure-a-legend',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.LegendHideSeries,
    title: 'Incrementally add series data to an isolated series',
    description: 'Use Command + click on series in the legend to exclude it from the visualization',
    level: AchievementLevel.Experienced,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-legend/#isolate-series-data-in-a-visualization',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.AddCustomThresholds,
    title: 'Add custom thresholds',
    description: '',
    level: AchievementLevel.Expert,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-thresholds/#add-or-delete-a-threshold',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.AddValueMapping,
    title: 'Add a value mapping',
    description:
      'Value mapping is a technique that you can use to change the visual treatment of data that appears in a visualization',
    level: AchievementLevel.Expert,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-value-mappings/#configure-value-mappings',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.AddAdvancedDataLink,
    title: 'Implement a data link using a template variable / panel data',
    description: '',
    level: AchievementLevel.Expert,
    link: 'https://grafana.com/docs/grafana/latest/panels-visualizations/configure-data-links/#template-variables',
    video: '',
    icon: 'link',
  },
  {
    id: AchievementId.UseJoinByFieldTransformation,
    title: 'Use a join by field transformation',
    description: '',
    level: AchievementLevel.Expert,
    link: '',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.MakePublicDashboard,
    title: 'Make a public dashboard',
    description: 'Public dashboards allow you to share your Grafana dashboard with anyone',
    level: AchievementLevel.Expert,
    link: 'https://grafana.com/docs/grafana/latest/dashboards/dashboard-public/#make-a-dashboard-public',
    video: '',
    icon: 'apps',
  },
  {
    id: AchievementId.StreamDataToGrafana,
    title: 'Stream data to Grafana',
    description: '',
    level: AchievementLevel.Wizard,
    link: 'https://grafana.com/docs/grafana/latest/setup-grafana/set-up-grafana-live/#set-up-grafana-live',
    video: '',
    icon: 'apps',
  },
];
