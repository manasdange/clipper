import { IsNotEmpty, IsOptional } from "@nestjs/class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FetchHighlightsRequestDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;

    @ApiProperty({required: false})
    @IsOptional()
    book?: string;

    @ApiProperty({required: false})
    @IsOptional()
    author?: string;
}

export class FetchAuthorsRequestDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;
}

export class FetchBooksRequestDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;

    @ApiProperty({required: false})
    @IsOptional()
    author: string;
}

export class UpdateAuthorRequestDto {
    @ApiProperty({required: true})
    @IsNotEmpty()
    username: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    currentName: string;

    @ApiProperty({required: true})
    @IsNotEmpty()
    updatedName: string;
}