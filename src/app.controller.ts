import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('Global')
@Controller()
export class AppController {
  @Get('/')
  @ApiOperation({
    summary: 'Will Redirect to the API Documentation (Swagger) ("/docs")',
  })
  testConnection(@Res() res: Response): void {
    // redirecting to API documentation (Swagger)
    res.redirect(`/docs`);
  }
}
