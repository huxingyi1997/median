import { Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import { ArticleEntity } from './entities/article.entity';

@Injectable()
export class ArticlesService {
  constructor(private prisma: PrismaService) {}

  async create(createArticleDto: CreateArticleDto) {
    const article = await this.prisma.article.create({
      data: createArticleDto,
    });
    return new ArticleEntity(article);
  }

  async findAll() {
    const articles = await this.prisma.article.findMany({
      where: { published: true },
    });
    return articles.map((article) => new ArticleEntity(article));
  }

  async findDrafts() {
    const drafts = await this.prisma.article.findMany({
      where: { published: false },
    });
    return drafts.map((draft) => new ArticleEntity(draft));
  }

  async findOne(id: number) {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
    if (!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`);
    }

    return new ArticleEntity(article);
  }

  async update(id: number, updateArticleDto: UpdateArticleDto) {
    const article = await this.prisma.article.update({
      where: { id },
      data: updateArticleDto,
    });
    return new ArticleEntity(article);
  }

  async remove(id: number) {
    const article = await this.prisma.article.delete({ where: { id } });
    return new ArticleEntity(article);
  }
}
