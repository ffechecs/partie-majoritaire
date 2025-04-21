UPDATE `games`
SET `settings` = json_set(`settings`, '$.challengerMoveConfirmation', json('true'))
WHERE json_type(`settings`, '$.challengerMoveConfirmation') IS NULL;