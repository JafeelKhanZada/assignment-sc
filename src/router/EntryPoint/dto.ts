import { IsNotEmpty, IsNumber, IsString } from "class-validator";

class InsertEntryPointDTO {
    @IsNotEmpty()
    @IsString()
    name!: string;

    @IsNotEmpty()
    @IsNumber()
    distance!: number;
}

export default InsertEntryPointDTO