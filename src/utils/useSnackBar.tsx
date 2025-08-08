import { useState } from 'react';
import ReactDOM from 'react-dom';
import Snackbar from './SnackBar';

export const useSnackbar = () => {
  const [snackbarState, setSnackbarState] = useState<{ message: string; isOpen: boolean }>({
    message: '',
    isOpen: false,
  });

  const showSnackbar = (message: string) => {
    setSnackbarState({ message, isOpen: true });
  };

  const closeSnackbar = () => {
    setSnackbarState({ ...snackbarState, isOpen: false });
  };

  const SnackbarComponent = () =>
    ReactDOM.createPortal(
      <Snackbar message={snackbarState.message} isOpen={snackbarState.isOpen} onClose={closeSnackbar} />,
      document.body
    );

  return { showSnackbar, SnackbarComponent };
};
