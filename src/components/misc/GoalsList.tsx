import React, { FunctionComponent } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';

interface Props {
  goals: (GoalRowProps & { key: string })[];
}

export const GoalsList: FunctionComponent<Props> = ({ goals = [] }) => {
  const goalRows = goals.map(goal => <GoalRow {...goal} />);

  return (
    <>
      {goalRows}
    </>
  );
};
