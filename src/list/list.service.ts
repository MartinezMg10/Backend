import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { Board } from 'src/board/entities/board.entity';
import { GetBoard } from 'src/auth/decorators/get-board.decorator';

@Injectable()
export class ListService {
  private readonly logger = new Logger('listService');


  constructor(

    @InjectRepository(List)
    private readonly listRepository: Repository<List>,
  ) {}

  async create(createListDto: CreateListDto, @GetBoard() board: Board) {
    try {
      const {...listDetails } = createListDto;

      const list = this.listRepository.create({
        ...listDetails,
        board,
      });
      
      await this.listRepository.save( list );

      return { ...list };
      
    } catch (error) {
      console.log(this.handleDBExceptions(error))
    }

  }

  async findAll() {
    const lists = await this.listRepository.find()

    return lists.map(list => ({
      ...list
    }))
  }

  async findOne(id: string) {
    const lists = await this.listRepository.find({ where: { board: { id: id } } });
  
    return lists.map(list => ({ ...list }));
  }

  update(id: string, updateListDto: UpdateListDto) {
    return `This action updates a #${id} list`;
  }

  remove(id: string) {
    return `This action removes a #${id} list`;
  }

  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

      this.logger.error(error)
    
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
