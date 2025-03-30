/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from './EntryList.module.css';
import clsx from 'clsx';

interface ActionBarProps {
  actions: string[];
  actionConfig: any;
  selectedRow: number;
  onAction: (actionKey: string) => void;
}

function ActionBar({ actions, actionConfig, selectedRow, onAction }: ActionBarProps) {
  return (
    <div className={styles.buttonContainer}>
      {actions.map((actionKey) => {
        const action = actionConfig[actionKey];
        const isDisabled =
          (actionKey === 'delete' || actionKey === 'edit') && selectedRow === -1;
        return (
          <button
            key={actionKey}
            className={clsx(styles.actionButton, {
              [styles.disabledButton]: isDisabled,
            })}
            onClick={() => onAction(actionKey)}
            disabled={isDisabled}
          >
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

export default ActionBar;