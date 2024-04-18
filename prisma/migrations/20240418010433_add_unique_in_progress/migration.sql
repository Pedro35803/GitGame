/*
  Warnings:

  - A unique constraint covering the columns `[id_player_progress,id_level]` on the table `CapterProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_orderLevel,id_capter_progress]` on the table `LevelProgress` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_capter,id_player]` on the table `PlayerProgress` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CapterProgress_id_player_progress_id_level_key" ON "CapterProgress"("id_player_progress", "id_level");

-- CreateIndex
CREATE UNIQUE INDEX "LevelProgress_id_orderLevel_id_capter_progress_key" ON "LevelProgress"("id_orderLevel", "id_capter_progress");

-- CreateIndex
CREATE UNIQUE INDEX "PlayerProgress_id_capter_id_player_key" ON "PlayerProgress"("id_capter", "id_player");
