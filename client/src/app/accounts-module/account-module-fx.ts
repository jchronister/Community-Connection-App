import { FormControl } from "@angular/forms"



// Password Validation
export function passwordVerification (el: FormControl) {

  if (el.value.length < 4) {
    return {msg: "Password Must be At Least 4 Characters"}
  }
  return null
}