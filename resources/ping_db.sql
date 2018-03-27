
-- Création de la base de données ping_db

ALTER DATABASE ping_db CHARACTER SET utf8 COLLATE utf8_general_ci;

-- Drop les tables
DROP TABLE IF EXISTS p_plays;
DROP TABLE IF EXISTS p_participates;
DROP TABLE IF EXISTS p_matches;
DROP TABLE IF EXISTS p_tournaments;
DROP TABLE IF EXISTS p_players;

-- Crée les tables
CREATE TABLE p_players
(
	player_id BIGINT NOT NULL AUTO_INCREMENT,
	player_lastname VARCHAR(100) NOT NULL,
	player_firstname VARCHAR(100) NOT NULL,
	player_rank INTEGER,
	player_username VARCHAR(100),
	player_email VARCHAR(100),
	player_password VARCHAR(300),
	player_salt VARCHAR(100),
	player_admin BOOLEAN NOT NULL,
	PRIMARY KEY (player_id),
	CONSTRAINT UC_Player UNIQUE (player_username,player_email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8  COMMENT='Table des joueurs';

CREATE TABLE p_tournaments
(
	tournament_id BIGINT NOT NULL AUTO_INCREMENT,
	tournament_date DATETIME NOT NULL,
	tournament_finished BOOLEAN NOT NULL,
	tournament_open BOOLEAN NOT NULL,
	tournament_current_turn INTEGER,
	tournament_referee_id BIGINT,
	PRIMARY KEY (tournament_id),
	FOREIGN KEY (tournament_referee_id) REFERENCES p_players(player_id) ON DELETE SET NULL 
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Table des tournois';

CREATE TABLE p_matches
(
	match_id BIGINT NOT NULL AUTO_INCREMENT,
	match_turn INTEGER,
	match_tournament_id BIGINT NOT NULL,
	PRIMARY KEY (match_id),
	FOREIGN KEY (match_tournament_id) REFERENCES p_tournaments(tournament_id) ON DELETE CASCADE	
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Table des matchs';

CREATE TABLE p_participates
(
	participates_tournament_id BIGINT NOT NULL,
	participates_player_id BIGINT NOT NULL,
	PRIMARY KEY (participates_tournament_id,participates_player_id),
	FOREIGN KEY (participates_tournament_id) REFERENCES p_tournaments(tournament_id) ON DELETE CASCADE,
	FOREIGN KEY (participates_player_id) REFERENCES p_players(player_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Table participe';

CREATE TABLE p_plays
(
	plays_score INT,
	plays_match_id BIGINT NOT NULL,
	plays_player_id BIGINT NOT NULL,
	PRIMARY KEY (plays_match_id,plays_player_id),
	FOREIGN KEY (plays_match_id) REFERENCES p_matches(match_id) ON DELETE CASCADE,
	FOREIGN KEY (plays_player_id) REFERENCES p_players(player_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT='Table joue';
