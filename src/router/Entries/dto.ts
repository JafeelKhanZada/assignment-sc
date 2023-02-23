import { IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";

class InsertEntryDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z]{3}-[0-9]{3}$/)
    plate!: string;

    @IsNotEmpty()
    @IsNumber()
    entryId!: number;

    @IsNotEmpty()
    @IsString()
    entryDate!: string

}

class InsertExitDTO {
    @IsNotEmpty()
    @IsString()
    @Matches(/^[A-Za-z]{3}-[0-9]{3}$/)
    plate!: string;

    @IsNotEmpty()
    @IsNumber()
    exitId!: number;

    @IsNotEmpty()
    @IsString()
    exitDate!: string

}

export { InsertEntryDTO, InsertExitDTO }
