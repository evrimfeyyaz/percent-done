import React, { FunctionComponent } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';

export interface GoalListProps {
  goals: (GoalRowProps & { key: string })[];
}

export const GoalList: FunctionComponent<GoalListProps> = ({ goals = [] }) => {
  const goalRows = goals.map(goal => <GoalRow {...goal} />);

  return (
    <>
      {goalRows}
    </>
  );
};
