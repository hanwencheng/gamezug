/**
 * Created by hanwencheng on 1/19/16.
 */

import memoize from 'lru-memoize';
import {createValidator, required, email, numberAndLetter,integer, isImage, phoneNumber, between} from 'utils/validation';

const submitValidation = createValidator({
  name : [required],
  description : [],
  brand : [required],
  production_date : [required],
  expiration_date : [],
  batch_number : [],
  total_number : [],
  address: []
});
export default memoize(10)(submitValidation);