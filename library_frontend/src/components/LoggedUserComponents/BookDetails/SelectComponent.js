import React from 'react';
export default function Select(){
  return(
<select name="readselect" id="read">
  <option value="read">Read</option>
  <option value="reading">Currently Reading</option>
  <option value="want">Want To Read</option>
  
</select>
  );
}