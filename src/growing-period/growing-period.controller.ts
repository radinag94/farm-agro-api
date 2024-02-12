import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { GrowingPeriodService } from './growing-period.service';
import { CreateGrowingPeriodDto } from './dto/create-growing-period.dto';
import { UpdateGrowingPeriodDto } from './dto/update-growing-period.dto';
import { Roles } from 'src/user/decorators/roles.decorator';
import { UserRole } from 'src/user/user-role.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(RolesGuard)
@Controller('growing-period')
export class GrowingPeriodController {
  constructor(private readonly growingPeriodService: GrowingPeriodService) {}

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Post('/create')
  async create(@Body() createGrowingPeriodDto: CreateGrowingPeriodDto) {
    return this.growingPeriodService.create(
      createGrowingPeriodDto.cropId,
      createGrowingPeriodDto.fieldId,
      createGrowingPeriodDto.processTypeId,
      createGrowingPeriodDto.machineId, // Ensure your DTO includes this field
    );
  }

  @Get()
  findAll() {
    return this.growingPeriodService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.growingPeriodService.findOne(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGrowingPeriodDto: UpdateGrowingPeriodDto,
  ) {
    return this.growingPeriodService.update(id, updateGrowingPeriodDto);
  }

  @Get(':fieldId/growing-periods')
  findGrowingPeriodsByFieldId(@Param('fieldId') fieldId: string) {
    return this.growingPeriodService.findGrowingPeriodsByFieldId(fieldId);
  }

  @Roles(UserRole.OWNER)
  @Delete(':id/permanent')
  removePermanent(@Param('id', ParseUUIDPipe) id: string) {
    console.log(
      `Attempting permanent removal for growing period with id :${id}`,
    );
    return this.growingPeriodService.removePermanent(id);
  }

  @Roles(UserRole.OWNER, UserRole.OPERATOR)
  @Delete(':id/soft')
  removeSoft(@Param('id', ParseUUIDPipe) id: string) {
    console.log(`Attempting soft removal for growing period with id:${id}`);
    return this.growingPeriodService.removeSoft(id);
  }
}
