import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCategoryDto) {
    const exists = await this.prisma.category.findUnique({
      where: { name: dto.name },
    });

    if (exists) {
      throw new ConflictException('Categoria já existe');
    }

    return this.prisma.category.create({ data: dto });
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.category.delete({ where: { id } });

    return { message: 'Categoria removida com sucesso' };
  }
}
