import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { Board } from './entities/board.entity';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { isUUID } from 'class-validator';

@Injectable()
export class BoardService {

  private readonly logger = new Logger('ProductsService');


  constructor(

    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,

    private readonly dataSource: DataSource,

  ) {}

  async create(createBoardDto: CreateBoardDto, user: User) {
    try {
      const {...boardDetails } = createBoardDto;

      const board = this.boardRepository.create({
        ...boardDetails,
        user,
      });
      
      await this.boardRepository.save( board );

      return { ...board };
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }


  async findAll() {
    const boards = await this.boardRepository.find()

    return boards.map(board => ({
      ...board
    }))
  }

  async findOne(term: string) {
    let board:Board;

    if(isUUID(term)){
      board = await this.boardRepository.findOneBy({id: term})
    }

    if (!board) {
      throw new BadRequestException(`Board with term ${term} not found`);
    }
    return board;

  }

  async findAllByUser(creatorId: string) {
    const boards = await this.boardRepository.find({ where: { user: { id: creatorId } } });
  
    return boards.map(board => ({ ...board }));
  }
  

  async update(id: string, updateBoardDto: UpdateBoardDto) {
    const {...toUpdate} = updateBoardDto;

    const board = await this.boardRepository.preload({id,...toUpdate})

    if (!board) throw new NotFoundException(`Product with id:${id} not found`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction()

    try {

      await queryRunner.manager.save( board);
      await queryRunner.commitTransaction();
      await queryRunner.release();

      return board;

    } catch (error) {

      await queryRunner.rollbackTransaction()
      await queryRunner.release();

      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const board = await this.findOne(id);
    await this.boardRepository.remove(board);
  }

  
  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' )
      throw new BadRequestException(error.detail);

      this.logger.error(error)
    
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
