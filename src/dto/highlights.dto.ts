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