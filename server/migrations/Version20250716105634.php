<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250716105634 extends AbstractMigration
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
            ALTER TABLE follow ADD CONSTRAINT FK_68344470AC24F853 FOREIGN KEY (follower_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE follow ADD CONSTRAINT FK_68344470D956F010 FOREIGN KEY (followed_id) REFERENCES users (id) NOT DEFERRABLE INITIALLY IMMEDIATE
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
        $this->addSql(<<<'SQL'
            ALTER TABLE posts ADD saved_count INT DEFAULT 0 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD name VARCHAR(180) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD themes JSON DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD followers_nb INT DEFAULT 0 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD following_nb INT DEFAULT 0 NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP location
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP website
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP status
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP is_verified
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP email_verified_at
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP last_login_at
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP language
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP timezone
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ALTER username DROP NOT NULL
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
            DROP TABLE user_like_post
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_repost
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE user_save_post
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD location VARCHAR(255) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD website VARCHAR(255) DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD status VARCHAR(20) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD is_verified BOOLEAN DEFAULT false NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD email_verified_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD last_login_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD language VARCHAR(10) DEFAULT 'fr' NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ADD timezone VARCHAR(50) DEFAULT 'Europe/Paris' NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP name
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP themes
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP followers_nb
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users DROP following_nb
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE users ALTER username SET NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE posts DROP saved_count
        SQL);
    }
}
