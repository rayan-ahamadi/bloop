<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250803091925 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE message_reads (room_message_id INT NOT NULL, user_id INT NOT NULL, PRIMARY KEY(room_message_id, user_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_37E6935A67886335 ON message_reads (room_message_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_37E6935AA76ED395 ON message_reads (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message_reads ADD CONSTRAINT FK_37E6935A67886335 FOREIGN KEY (room_message_id) REFERENCES rooms_messages (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message_reads ADD CONSTRAINT FK_37E6935AA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message_reads DROP CONSTRAINT FK_37E6935A67886335
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE message_reads DROP CONSTRAINT FK_37E6935AA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE message_reads
        SQL);
    }
}
