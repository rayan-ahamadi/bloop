<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250715122407 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE posts (id SERIAL NOT NULL, user_id INT NOT NULL, parent_post_id INT DEFAULT NULL, content TEXT NOT NULL, type VARCHAR(20) NOT NULL, language VARCHAR(10) DEFAULT 'fr' NOT NULL, likes_count INT DEFAULT 0 NOT NULL, retweets_count INT DEFAULT 0 NOT NULL, views_count INT DEFAULT 0 NOT NULL, impressions_count INT DEFAULT 0 NOT NULL, clicks_count INT DEFAULT 0 NOT NULL, engagement_score DOUBLE PRECISION DEFAULT '0' NOT NULL, is_pinned BOOLEAN DEFAULT false NOT NULL, status VARCHAR(20) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_885DBAFAA76ED395 ON posts (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_885DBAFA39C1776A ON posts (parent_post_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE users (id SERIAL NOT NULL, username VARCHAR(180) NOT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, bio TEXT DEFAULT NULL, avatar_url VARCHAR(255) DEFAULT NULL, banner_url VARCHAR(255) DEFAULT NULL, location VARCHAR(255) DEFAULT NULL, website VARCHAR(255) DEFAULT NULL, birth_date DATE DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, status VARCHAR(20) NOT NULL, is_verified BOOLEAN DEFAULT false NOT NULL, email_verified_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, last_login_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, language VARCHAR(10) DEFAULT 'fr' NOT NULL, timezone VARCHAR(50) DEFAULT 'Europe/Paris' NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_1483A5E9F85E0677 ON users (username)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts ADD CONSTRAINT FK_885DBAFAA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts ADD CONSTRAINT FK_885DBAFA39C1776A FOREIGN KEY (parent_post_id) REFERENCES posts (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts DROP CONSTRAINT FK_885DBAFAA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts DROP CONSTRAINT FK_885DBAFA39C1776A
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE posts
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE users
        SQL);
    }
}
