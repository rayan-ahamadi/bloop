<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;



final class Version20250806092202_add_identifier_to_chat_room extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add identifier column to chat_rooms table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE chat_rooms ADD identifier VARCHAR(100) DEFAULT NULL');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_82C6C6AC772E836A ON chat_rooms (identifier)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP INDEX UNIQ_82C6C6AC772E836A ON chat_rooms');
        $this->addSql('ALTER TABLE chat_rooms DROP identifier');
    }
}