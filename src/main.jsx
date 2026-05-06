const framework = localStorage.getItem('ui-framework') || 'primereact';

if (framework === 'mui') {
  import('./mui/main.jsx');
} else {
  import('./primereact/main.jsx');
}
