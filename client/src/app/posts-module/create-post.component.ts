import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountState } from '../account-state';
import { IForm } from '../app.types';
import { MainServiceService } from './main-service.service';

@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styles: [],
})
export class CreatePostComponent implements OnInit {
  myForm: FormGroup;

  type = ['Help Request', 'Service Provider'];

  constructor(
    private myService: MainServiceService,
    private fb: FormBuilder,
    private state: AccountState
  ) {
    this.myForm = fb.group({
      type: ['Help Request', Validators.required],
      description: ['Your description goes here', Validators.required],
    });

    // this.myForm.valueChanges.subscribe((data: any) => {
    //   console.log(data);
    // });
  }

  onSubmit() {
    console.log(this.myForm);

    if (!this.myForm.get('type')) {
      return;
    }

    let dataObj = {
      ...this.myForm.value,
      date: new Date(),
      user: this.state.getCurrentUserInfo(),
    };

    if (this.myForm.get('type')!.value == 'Help Request') {
      this.myService.newHelpRequest(dataObj).subscribe((data) => {
        if (data.status === 'Success') {
          this.myForm.reset();
          alert('Form submitted');
        }
      });
    } else {
      this.myService.newServiceProvider(dataObj).subscribe((data) => {
        if (data.status === 'Success') {
          this.myForm.reset();
          alert('Form submitted');
        }
      });
    }
  }

  ngOnInit(): void {}
}
