import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from 'src/lists/entities/list.entity';
import { User } from 'src/users/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Card } from './entities/card.entity';
import { NotFoundError } from 'rxjs';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@Injectable()
export class CardsService {
    constructor(
        @InjectRepository(Card)
        private readonly cardRepository: Repository<Card>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        @InjectRepository(List)
        private readonly listRepository: Repository<List>,
    ) {}

    async create(createCardDto: CreateCardDto) {
        const list = await this.listRepository.findOneBy({id: createCardDto.listId});
        if(!list) throw new NotFoundException('List not found');

        const card = this.cardRepository.create({
            ...createCardDto,
            list,
        });

        if(createCardDto.assigneeIds?.length) {
            const users = await this.userRepository.findBy({
                id: In(createCardDto.assigneeIds)
            });

            card.assignees = users;
        }
        return this.cardRepository.save(card);
    }

    async findAll() {
        return this.cardRepository
            .createQueryBuilder('card')
            .leftJoinAndSelect('card.list', 'list')
            .leftJoinAndSelect('card.assignees', 'assignees')
            .leftJoinAndSelect('card.comments', 'comments')
            .getMany();
        }


    async findOne(id: number) {
        const card = await this.cardRepository.findOne({
            where: {id}, 
            relations: ['list', 'assignees', 'comments']
        });
        if(!card) throw new NotFoundException('Card not found');

        return card;
    }

    async update(id: number, updateCardDto: UpdateCardDto) {
        const card = await this.findOne(id);

        if(updateCardDto.listId && updateCardDto.listId !== card.list.id) {
            const list = await this.listRepository.findOneBy({id: updateCardDto.listId});
            if(!list) throw new NotFoundException('List not found');    
            card.list = list;
        }

        if(updateCardDto.assigneeIds) {
            const assignees = await this.userRepository.findBy({
                id: In(updateCardDto.assigneeIds)
            });
            card.assignees = assignees;
        }

        Object.assign(card, updateCardDto);
        return this.cardRepository.save(card);
    }

    async remove(id: number) {
        const card = await this.findOne(id);
        return this.cardRepository.remove(card);    
    }

}
