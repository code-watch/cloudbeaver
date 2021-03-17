/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import styled from 'reshadow';

import { BASE_CONTAINERS_STYLES, TextareaNew } from '@cloudbeaver/core-blocks';
import { useStyles } from '@cloudbeaver/core-theming';

import { ResultSetFormatAction } from '../../DatabaseDataModel/Actions/ResultSetFormatAction';
import { IResultSetSelectKey, ResultSetSelectAction } from '../../DatabaseDataModel/Actions/ResultSetSelectAction';
import type { IDatabaseResultSet } from '../../DatabaseDataModel/IDatabaseResultSet';
import type { DataPresentationComponent } from '../../DataPresentationService';

export const TextValuePresentation: DataPresentationComponent<any, IDatabaseResultSet> = observer(function TextValuePresentation({
  model,
  resultIndex,
}) {
  const styles = useStyles(BASE_CONTAINERS_STYLES);
  const selection = model.source.getAction(resultIndex, ResultSetSelectAction);

  const result = model.getResult(resultIndex);
  const selectedCells = selection.getSelectedElements();

  let value: any;
  let stringValue: string | undefined;
  let firstSelectedCell: Required<IResultSetSelectKey> | undefined;

  if (result?.data?.rows && selectedCells.length > 0) {
    firstSelectedCell = selectedCells[0];
    value = model.source
      .getEditor(resultIndex)
      .getCell(firstSelectedCell.row, firstSelectedCell.column);

    stringValue = model.source
      .getAction(resultIndex, ResultSetFormatAction)
      .get(value);
  }

  const handleChange = (value: string) => {
    if (firstSelectedCell) {
      model.source
        .getEditor(resultIndex)
        .setCell(firstSelectedCell.row, firstSelectedCell.column, value);
    }
  };

  return styled(styles)(
    <TextareaNew
      name="value"
      rows={3}
      value={stringValue}
      disabled={stringValue === undefined}
      readOnly={model.isReadonly() || (value !== null && typeof value === 'object')}
      embedded
      onChange={handleChange}
    />
  );
});
