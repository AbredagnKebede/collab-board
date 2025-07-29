import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { List } from './entities/list.entity';
import { Board } from 'src/boards/entities/board.entity';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';

@Injectable()
export class ListsService {
    constructor(
        @InjectRepository(List)
        private readonly listRepository: Repository<List>,

        @InjectRepository(Board)
        private readonly boardRepository: Repository<Board>,
    ) {}

    async create(createListDto: CreateListDto) {
        const board = await this.boardRepository.findOneBy({id: createListDto.boardId});
        if(!board) throw new NotFoundException('Board not found');

        const list = await this.listRepository.create({
            title: createListDto.title,
            order: createListDto.order ?? 0,
            board,
        });

        return this.listRepository.save(list);
    }

    async findAll() {
        return this.listRepository.find({relations: ['board', 'cards']});
    }

    async findOne(id: number) {
        const list = await this.listRepository.findOne({
            where: {id},
            relations: ['board', 'cards']
        });

        if(!list) throw new NotFoundException('List not found');
        return list;
    }

    async update(id: number, updateListDto: UpdateListDto) {
        const list = await this.findOne(id);
        Object.assign(list, updateListDto);

        return this.listRepository.save(list);
    }

    async remove(id: number) {
        const list = await this.findOne(id);
        return this.listRepository.remove(list);
    }
}
