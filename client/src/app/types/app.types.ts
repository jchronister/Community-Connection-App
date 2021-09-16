export interface IUser {
  _id: string;
  username: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: number;
  phone: string;
  email: string;
}

export interface IPosts {
  _id : string;
  type: string;
  city_state: string;
  date: string;
  description: string;
  user: IUser;
  comments: Array <IComments>;
}

export interface IComments {
  comment: string;
  user: IUser;
  date: string | Date;
}

export interface IServerObject {
  status: 'Failed' | 'Success';
  data: any | null;
  nModified: number | null;
  error: string | null;
}

export interface IForm {
  "type" : string,
  "city_state" : string,
  "date" : string | Date,
  "description" : string
}


export function  newIUser () {

  return {
  _id: "",
  username: "",
  name: "",
  address: "",
  city: "",
  state: "",
  zip: 0,
  phone: "",
  email: "",
  }
}

export function newIPosts () {

  return {
    _id : "",
    type: "",
    city_state: "",
    date: "",
    description: "",
    user: newIUser (),
    comments: [newIComments ()]
  }
}

export function newIComments () {
  
  return {
  comment: "",
  user: newIUser (),
  date: ""
  }
}