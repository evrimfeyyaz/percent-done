import React, { FunctionComponent } from 'react';
import { GoalRow, GoalRowProps } from './GoalRow';

export interface GoalListProps {
  goals: (GoalRowProps & { key: string })[];
  onGoalPress?: (goalId: string) => void;
}

export const GoalList: FunctionComponent<GoalListProps> = ({ goals = [], onGoalPress }) => {
  const goalRows = goals.map(goal => <GoalRow {...goal} onPress={onGoalPress} />);

  return (
    <>
      {goalRows}
    </>
  );
};
