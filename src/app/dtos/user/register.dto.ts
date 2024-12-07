import {
    IsString,
    IsNotEmpty,
    IsPhoneNumber
}from 'class-validator' ;

export class RegisterDTO{
  @IsPhoneNumber()
  phone: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  retypePassword: string;

  @IsString()
  name: string;


  role_id: number;

  constructor(data : any){
    this.phone = data.phone ;
    this.password = data.password ;
    this.retypePassword = data.retypePassword ;
    this.name = data.name ;
    this.role_id = data.role_id || 1 ;
  }

}