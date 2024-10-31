export interface IEvent{
    title: string;
    description:string;
    date:Date;
    totalSeats:number;
    availableSeats:number;
}

export interface IUser{
    username:string;
    role:string;
    password:string;
}