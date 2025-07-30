import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Card } from 'src/cards/entities/card.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { Comment } from './entities/comment.entity';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
    constructor(
        @InjectRepository(Comment)
        private commentRepository: Repository<Comment>,

        @InjectRepository(Card)
        private cardRepository: Repository<Card>,
    ) {}

    async create(createCommentDto: CreateCommentDto, user: User) {
        const card = await this.cardRepository.findOne({where: {id: createCommentDto.cardId}});
        if(!card) throw new NotFoundException('Card not found');

        const comment = this.commentRepository.create({
            content: createCommentDto.content,
            card,
            author: user,
        });

        return this.commentRepository.save(comment);
    }

    async findByCard(cardId: number) {
        return this.commentRepository.findOne({
            where: {card: {id: cardId}},
            relations: ['author'],
        })
    };

    async update(id: number, updateCommentDto: UpdateCommentDto) {
        const comment = await this.commentRepository.findOneBy({id});
        if(!comment) throw new NotFoundException('Comment not found');

        comment.content = updateCommentDto.content;
        return this.commentRepository.save(comment);
    }

    async remove(id: number) {
        const comment = await this.commentRepository.findOneBy({id});
        if(!comment) throw new NotFoundException('Comment not found');

        return this.commentRepository.remove(comment);  
    }
}
