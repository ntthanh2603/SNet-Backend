// import { Injectable } from '@nestjs/common';
// import { ElasticsearchService } from '@nestjs/elasticsearch';
// import {
//   EventSubscriber,
//   EntitySubscriberInterface,
//   InsertEvent,
//   UpdateEvent,
//   RemoveEvent,
// } from 'typeorm';
// import { User } from './entities/user.entity';

// @Injectable()
// @EventSubscriber()
// export class UserSubscriber implements EntitySubscriberInterface<User> {
//   constructor(private readonly elasticsearchService: ElasticsearchService) {}

//   listenTo() {
//     return User;
//   }

//   // ✅ Khi thêm mới User → Lưu vào Elasticsearch
//   async afterInsert(event: InsertEvent<User>) {
//     await this.elasticsearchService.index({
//       index: 'users',
//       id: event.entity.id,
//       body: event.entity,
//     });
//   }

//   // ✅ Khi cập nhật User → Cập nhật trong Elasticsearch
//   async afterUpdate(event: UpdateEvent<User>) {
//     if (!event.entity) return;
//     await this.elasticsearchService.update({
//       index: 'users',
//       id: event.entity.id,
//       body: {
//         doc: event.entity,
//       },
//     });
//   }

//   // ✅ Khi xóa User → Xóa khỏi Elasticsearch
//   async afterRemove(event: RemoveEvent<User>) {
//     if (!event.entityId) return;
//     await this.elasticsearchService.delete({
//       index: 'users',
//       id: event.entityId.toString(),
//     });
//   }
// }
