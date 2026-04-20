import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  create(@Body() dto: CreateTransactionDto) {
    return this.transactionService.create(dto);
  }

  @Get('user/:userId')
  findAllByUser(@Param('userId') userId: string) {
    return this.transactionService.findAllByUser(userId);
  }

  @Get('summary/:userId')
  getMonthlySummary(
    @Param('userId') userId: string,
    @Query('year') year: string,
    @Query('month') month: string,
  ) {
    return this.transactionService.getMonthlySummary(
      userId,
      Number(year),
      Number(month),
    );
  }

  @Get('category-summary/:userId')
  getCategorySummary(
    @Param('userId') userId: string,
    @Query('name') name: string,
    @Query('year') year?: string,
    @Query('month') month?: string,
  ) {
    if (!name) {
      throw new BadRequestException('Category name query param is required');
    }

    return this.transactionService.getCategorySummary(
      userId,
      name,
      year ? Number(year) : undefined,
      month ? Number(month) : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTransactionDto) {
    return this.transactionService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionService.remove(id);
  }
}
