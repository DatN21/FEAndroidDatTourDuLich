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

  constructor(data : any){
    this.phone = data.phone ;
    this.password = data.password ;
    this.retypePassword = data.retypePassword ;
    this.name = data.name ;
  }

}