DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'appuser') THEN
      CREATE ROLE appuser WITH LOGIN PASSWORD 'app_pass';
   END IF;
END
$do$;

ALTER DATABASE appdb OWNER TO appuser;

