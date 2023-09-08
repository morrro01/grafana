import { css } from '@emotion/css';
import React, { useCallback } from 'react';

import { GrafanaTheme2, ThemeSpacingTokens } from '@grafana/data';

import { useStyles2 } from '../../themes';

export type ItemsAlignment = 'start' | 'end' | 'center' | 'stretch';

export type ContentAlignment = ItemsAlignment | 'space-around' | 'space-between' | 'space-evenly';
export interface GridProps {
  children: NonNullable<React.ReactNode>;
  display?: 'grid' | 'inline-grid';
  gap?: ThemeSpacingTokens;
  columnGap?: ThemeSpacingTokens;
  rowGap?: ThemeSpacingTokens;
  templateColumns?: string;
  templateRows?: string;
  justifyItems?: ItemsAlignment;
  alignItems?: ItemsAlignment;
  autoFlow?: 'row' | 'column' | 'row dense' | 'column dense';
  autoRows?: string;
}

export interface GridItemProps {
  children: NonNullable<React.ReactNode>;
  columnStart?: string;
  columnEnd?: number | `span ${number}`;
  rowStart?: string;
  rowEnd?: number | `span ${number}`;
}

export const Grid = ({
  children,
  display = 'grid',
  gap = 1,
  columnGap = 0,
  rowGap = 0,
  templateColumns = 'none',
  templateRows = 'none',
  alignItems = 'stretch',
  justifyItems = 'stretch',
  autoFlow = 'row',
  autoRows = 'auto',
  columnStart,
  columnEnd,
  rowStart,
  rowEnd,
}: GridProps & GridItemProps) => {
  const styles = useStyles2(
    useCallback(
      (theme) =>
        getStyles(
          theme,
          display,
          gap,
          columnGap,
          rowGap,
          templateColumns,
          templateRows,
          alignItems,
          justifyItems,
          autoFlow,
          autoRows,
          columnStart,
          columnEnd,
          rowStart,
          rowEnd,
        ),
      [
        display,
        columnGap,
        rowGap,
        gap,
        templateColumns,
        templateRows,
        alignItems,
        justifyItems,
        autoRows,
        autoFlow,
        columnStart,
        columnEnd,
        rowStart,
        rowEnd,
      ]
    )
  );

  const childrenWithProps = React.Children.map(children, (child) => {
    return child && React.cloneElement(child as React.ReactElement, { className: styles.gridItem });
  });

  return <div className={styles.grid}>{childrenWithProps}</div>;
};

Grid.displayName = 'Grid';

const getStyles = (
  theme: GrafanaTheme2,
  display: 'grid' | 'inline-grid',
  gap: ThemeSpacingTokens,
  columnGap: ThemeSpacingTokens,
  rowGap: ThemeSpacingTokens,
  templateColumns: GridProps['templateColumns'],
  templateRows: GridProps['templateRows'],
  alignItems: GridProps['alignItems'],
  justifyItems: GridProps['justifyItems'],
  autoFlow: GridProps['autoFlow'],
  autoRows: GridProps['autoRows'],
  columnStart?: GridItemProps['columnStart'],
  columnEnd?: GridItemProps['columnEnd'],
  rowStart?: GridItemProps['rowStart'],
  rowEnd?: GridItemProps['rowEnd'],
) => {
  return {
    grid: css({
      display,
      gap: rowGap || columnGap ? undefined : theme.spacing(gap),
      columnGap: columnGap ? theme.spacing(columnGap) : undefined,
      rowGap: rowGap ? theme.spacing(rowGap) : undefined,
      gridTemplateColumns: templateColumns,
      gridTemplateRows: templateRows,
      justifyContent: 'stretch',
      alignContent: 'stretch',
      justifyItems,
      alignItems,
      gridAutoFlow: autoFlow,
      gridAutoRows: autoRows,
    }),
    gridItem: css({
      gridColumnStart: columnStart,
      gridColumnEnd: columnEnd,
      gridRowStart: rowStart,
      gridRowEnd: rowEnd,
    }),
  };
};
