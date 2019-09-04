import React, { FunctionComponent } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';

export interface GoalsListProps {
  goals: (GoalRowProps & { key: string })[];
}

export const GoalsList: FunctionComponent<GoalsListProps> = ({ goals = [] }) => {
  const goalRows = goals.map(goal => <GoalRow {...goal} />);

  return (
    <>
      {goalRows}
    </>
  );
};
