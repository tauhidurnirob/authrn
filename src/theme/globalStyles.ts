export { makeStyles } from './makeStyles';
export type { AppStyles } from './makeStyles';

import { makeStyles } from './makeStyles';
import { lightColors } from './palette';

export const globalStyles = makeStyles(lightColors);
