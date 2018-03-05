import styles from './styles.css';

export default ({ name }) =>
  `<div class=${styles.awesome}>Hello ${name.toUpperCase()}!</div>`;
