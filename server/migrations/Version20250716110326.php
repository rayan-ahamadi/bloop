<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250716110326 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE follow (follower_id INT NOT NULL, followed_id INT NOT NULL, followed_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(follower_id, followed_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_68344470AC24F853 ON follow (follower_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_68344470D956F010 ON follow (followed_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE posts (id SERIAL NOT NULL, user_id INT NOT NULL, parent_post_id INT DEFAULT NULL, content TEXT NOT NULL, type VARCHAR(20) NOT NULL, language VARCHAR(10) DEFAULT 'fr' NOT NULL, likes_count INT DEFAULT 0 NOT NULL, retweets_count INT DEFAULT 0 NOT NULL, saved_count INT DEFAULT 0 NOT NULL, views_count INT DEFAULT 0 NOT NULL, impressions_count INT DEFAULT 0 NOT NULL, clicks_count INT DEFAULT 0 NOT NULL, engagement_score DOUBLE PRECISION DEFAULT '0' NOT NULL, is_pinned BOOLEAN DEFAULT false NOT NULL, status VARCHAR(20) NOT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_885DBAFAA76ED395 ON posts (user_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_885DBAFA39C1776A ON posts (parent_post_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_like_post (user_id_id INT NOT NULL, post_id INT NOT NULL, liked_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(user_id_id, post_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_831F3D179D86650F ON user_like_post (user_id_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_831F3D174B89032C ON user_like_post (post_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN user_like_post.liked_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_repost (user_id_id INT NOT NULL, post_id INT NOT NULL, reposted_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(user_id_id, post_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B8665DF89D86650F ON user_repost (user_id_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_B8665DF84B89032C ON user_repost (post_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN user_repost.reposted_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE user_save_post (user_id_id INT NOT NULL, post_id INT NOT NULL, saved_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(user_id_id, post_id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_258A560C9D86650F ON user_save_post (user_id_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_258A560C4B89032C ON user_save_post (post_id)
        SQL);
        $this->addSql(<<<'SQL'
            COMMENT ON COLUMN user_save_post.saved_at IS '(DC2Type:datetime_immutable)'
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE users (id SERIAL NOT NULL, name VARCHAR(180) NOT NULL, username VARCHAR(180) DEFAULT NULL, email VARCHAR(180) NOT NULL, password VARCHAR(255) NOT NULL, bio TEXT DEFAULT NULL, avatar_url VARCHAR(255) DEFAULT NULL, banner_url VARCHAR(255) DEFAULT NULL, birth_date DATE DEFAULT NULL, themes JSON DEFAULT NULL, created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, updated_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, deleted_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL, followers_nb INT DEFAULT 0 NOT NULL, following_nb INT DEFAULT 0 NOT NULL, PRIMARY KEY(id))
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_1483A5E9F85E0677 ON users (username)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE UNIQUE INDEX UNIQ_1483A5E9E7927C74 ON users (email)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow ADD CONSTRAINT FK_68344470AC24F853 FOREIGN KEY (follower_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow ADD CONSTRAINT FK_68344470D956F010 FOREIGN KEY (followed_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts ADD CONSTRAINT FK_885DBAFAA76ED395 FOREIGN KEY (user_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts ADD CONSTRAINT FK_885DBAFA39C1776A FOREIGN KEY (parent_post_id) REFERENCES posts (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_like_post ADD CONSTRAINT FK_831F3D179D86650F FOREIGN KEY (user_id_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_like_post ADD CONSTRAINT FK_831F3D174B89032C FOREIGN KEY (post_id) REFERENCES posts (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_repost ADD CONSTRAINT FK_B8665DF89D86650F FOREIGN KEY (user_id_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_repost ADD CONSTRAINT FK_B8665DF84B89032C FOREIGN KEY (post_id) REFERENCES posts (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_save_post ADD CONSTRAINT FK_258A560C9D86650F FOREIGN KEY (user_id_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_save_post ADD CONSTRAINT FK_258A560C4B89032C FOREIGN KEY (post_id) REFERENCES posts (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE SCHEMA public
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow DROP CONSTRAINT FK_68344470AC24F853
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow DROP CONSTRAINT FK_68344470D956F010
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts DROP CONSTRAINT FK_885DBAFAA76ED395
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts DROP CONSTRAINT FK_885DBAFA39C1776A
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_like_post DROP CONSTRAINT FK_831F3D179D86650F
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_like_post DROP CONSTRAINT FK_831F3D174B89032C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_repost DROP CONSTRAINT FK_B8665DF89D86650F
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_repost DROP CONSTRAINT FK_B8665DF84B89032C
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_save_post DROP CONSTRAINT FK_258A560C9D86650F
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE user_save_post DROP CONSTRAINT FK_258A560C4B89032C
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE follow
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE posts
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_like_post
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_repost
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_save_post
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE users
        SQL);
    }
}
