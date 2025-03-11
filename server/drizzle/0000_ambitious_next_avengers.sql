CREATE TABLE `email_verification_code` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`email` text NOT NULL,
	`code` text NOT NULL,
	`expires_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text(36) NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`role` text DEFAULT 'user' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `games` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`settings` text NOT NULL,
	`challenger_code` text NOT NULL,
	`majority_code` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moves` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text(36) NOT NULL,
	`player_id` text(36),
	`move_san` text NOT NULL,
	`fen` text NOT NULL,
	`move_number` integer NOT NULL,
	`color` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL,
	`user_id` text(36) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `players_connections` (
	`id` text PRIMARY KEY NOT NULL,
	`player_id` text(36) NOT NULL,
	`connected` integer DEFAULT false NOT NULL,
	`created_at` text NOT NULL,
	`game_id` text(36) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `votes` (
	`id` text PRIMARY KEY NOT NULL,
	`game_id` text(36) NOT NULL,
	`move_san` text NOT NULL,
	`fen` text NOT NULL,
	`move_number` integer NOT NULL,
	`player_id` text(36) NOT NULL,
	`color` text NOT NULL,
	`created_at` text NOT NULL
);
