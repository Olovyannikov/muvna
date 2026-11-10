import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_pages_blocks_statement_theme" AS ENUM('light', 'dark', 'sand');
  CREATE TYPE "public"."enum_pages_blocks_split_media_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum_pages_blocks_split_media_theme" AS ENUM('light', 'dark', 'sand');
  CREATE TYPE "public"."enum_pages_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_blocks_statement_theme" AS ENUM('light', 'dark', 'sand');
  CREATE TYPE "public"."enum__pages_v_blocks_split_media_image_position" AS ENUM('left', 'right');
  CREATE TYPE "public"."enum__pages_v_blocks_split_media_theme" AS ENUM('light', 'dark', 'sand');
  CREATE TYPE "public"."enum__pages_v_blocks_rich_text_width" AS ENUM('narrow', 'wide');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__categories_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_series_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__series_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__series_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_products_badge" AS ENUM('new', 'hit', 'sale');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_badge" AS ENUM('new', 'hit', 'sale');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('ru', 'en');
  CREATE TYPE "public"."enum_orders_status" AS ENUM('new', 'processing', 'shipped', 'done', 'cancelled');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_site_socials_network" AS ENUM('telegram', 'vk', 'youtube', 'other');
  CREATE TYPE "public"."enum_site_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_v_version_socials_network" AS ENUM('telegram', 'vk', 'youtube', 'other');
  CREATE TYPE "public"."enum__site_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__site_v_published_locale" AS ENUM('ru', 'en');
  CREATE TABLE "pages_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "pages_blocks_hero_slides_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"theme" "enum_pages_blocks_statement_theme" DEFAULT 'light',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_statement_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_split_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum_pages_blocks_split_media_image_position" DEFAULT 'left',
  	"theme" "enum_pages_blocks_split_media_theme" DEFAULT 'light',
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_split_media_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" jsonb,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"width" "enum_pages_blocks_rich_text_width" DEFAULT 'narrow',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_rich_text_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_url" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_product_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_tiles_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar
  );
  
  CREATE TABLE "pages_blocks_category_tiles_tiles_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_category_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_category_tiles_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lead_form_locales" (
  	"title" varchar DEFAULT 'Получить оптовый прайс',
  	"text" jsonb,
  	"submit_label" varchar DEFAULT 'Отправить запрос',
  	"success_message" varchar DEFAULT 'Спасибо! Мы свяжемся с вами.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"link_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_hero_slides_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statement" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"theme" "enum__pages_v_blocks_statement_theme" DEFAULT 'light',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_statement_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_split_media" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"image_position" "enum__pages_v_blocks_split_media_image_position" DEFAULT 'left',
  	"theme" "enum__pages_v_blocks_split_media_theme" DEFAULT 'light',
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_split_media_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"text" jsonb,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"width" "enum__pages_v_blocks_rich_text_width" DEFAULT 'narrow',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_rich_text_locales" (
  	"title" varchar,
  	"content" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_product_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"link_url" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_product_grid_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"link_label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles_tiles_locales" (
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_category_tiles_locales" (
  	"eyebrow" varchar,
  	"title" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_blocks_lead_form" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lead_form_locales" (
  	"title" varchar DEFAULT 'Получить оптовый прайс',
  	"text" jsonb,
  	"submit_label" varchar DEFAULT 'Отправить запрос',
  	"success_message" varchar DEFAULT 'Спасибо! Мы свяжемся с вами.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer
  );
  
  CREATE TABLE "sections" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"image_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "sections_locales" (
  	"title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"section_id" integer,
  	"hero_image_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "categories_locales" (
  	"title" varchar,
  	"hero_title" varchar DEFAULT 'MUVNA',
  	"hero_subtitle" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_section_id" integer,
  	"version_hero_image_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__categories_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_categories_v_locales" (
  	"version_title" varchar,
  	"version_hero_title" varchar DEFAULT 'MUVNA',
  	"version_hero_subtitle" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "series" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"category_id" integer,
  	"anchor" varchar,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_series_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "series_locales" (
  	"title" varchar,
  	"tagline" varchar,
  	"heading" varchar,
  	"description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_series_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_category_id" integer,
  	"version_anchor" varchar,
  	"version_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__series_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__series_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_series_v_locales" (
  	"version_title" varchar,
  	"version_tagline" varchar,
  	"version_heading" varchar,
  	"version_description" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "products_specs_locales" (
  	"name" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_order" varchar,
  	"price" numeric,
  	"old_price" numeric,
  	"sku" varchar,
  	"in_stock" boolean DEFAULT true,
  	"badge" "enum_products_badge",
  	"image_id" integer,
  	"category_id" integer,
  	"series_id" integer,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar,
  	"materials" varchar,
  	"note" varchar,
  	"details" jsonb,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_specs_locales" (
  	"name" varchar,
  	"value" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__order" varchar,
  	"version_price" numeric,
  	"version_old_price" numeric,
  	"version_sku" varchar,
  	"version_in_stock" boolean DEFAULT true,
  	"version_badge" "enum__products_v_version_badge",
  	"version_image_id" integer,
  	"version_category_id" integer,
  	"version_series_id" integer,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_title" varchar,
  	"version_materials" varchar,
  	"version_note" varchar,
  	"version_details" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "orders_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"quantity" numeric NOT NULL,
  	"title" varchar,
  	"sku" varchar,
  	"price" numeric
  );
  
  CREATE TABLE "orders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_orders_status" DEFAULT 'new',
  	"customer_name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"email" varchar,
  	"city" varchar,
  	"address" varchar,
  	"comment" varchar,
  	"total" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"company" varchar,
  	"phone" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"message" varchar,
  	"page" varchar,
  	"processed" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumb_url" varchar,
  	"sizes_thumb_width" numeric,
  	"sizes_thumb_height" numeric,
  	"sizes_thumb_mime_type" varchar,
  	"sizes_thumb_filesize" numeric,
  	"sizes_thumb_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"sections_id" integer,
  	"categories_id" integer,
  	"series_id" integer,
  	"products_id" integer,
  	"orders_id" integer,
  	"leads_id" integer,
  	"media_id" integer,
  	"users_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "site_nav_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"network" "enum_site_socials_network",
  	"url" varchar
  );
  
  CREATE TABLE "site_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "site_footer_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"phone" varchar,
  	"_status" "enum_site_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_locales" (
  	"announcement" varchar,
  	"company_name" varchar,
  	"about" varchar,
  	"address" varchar,
  	"client_service" varchar,
  	"copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_v_version_nav_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_v_version_nav_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_v_version_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"network" "enum__site_v_version_socials_network",
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_v_version_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_site_v_version_footer_links_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_site_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_email" varchar,
  	"version_phone" varchar,
  	"version__status" "enum__site_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__site_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_site_v_locales" (
  	"version_announcement" varchar,
  	"version_company_name" varchar,
  	"version_about" varchar,
  	"version_address" varchar,
  	"version_client_service" varchar,
  	"version_copyright" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides" ADD CONSTRAINT "pages_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero_slides_locales" ADD CONSTRAINT "pages_blocks_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_hero" ADD CONSTRAINT "pages_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement" ADD CONSTRAINT "pages_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_statement_locales" ADD CONSTRAINT "pages_blocks_statement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_media" ADD CONSTRAINT "pages_blocks_split_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_media" ADD CONSTRAINT "pages_blocks_split_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_split_media_locales" ADD CONSTRAINT "pages_blocks_split_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_split_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text" ADD CONSTRAINT "pages_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_rich_text_locales" ADD CONSTRAINT "pages_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid" ADD CONSTRAINT "pages_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_product_grid_locales" ADD CONSTRAINT "pages_blocks_product_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_product_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_tiles" ADD CONSTRAINT "pages_blocks_category_tiles_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_tiles" ADD CONSTRAINT "pages_blocks_category_tiles_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_tiles_locales" ADD CONSTRAINT "pages_blocks_category_tiles_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_tiles_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles" ADD CONSTRAINT "pages_blocks_category_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_category_tiles_locales" ADD CONSTRAINT "pages_blocks_category_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form" ADD CONSTRAINT "pages_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lead_form_locales" ADD CONSTRAINT "pages_blocks_lead_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides" ADD CONSTRAINT "_pages_v_blocks_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero_slides_locales" ADD CONSTRAINT "_pages_v_blocks_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_hero" ADD CONSTRAINT "_pages_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement" ADD CONSTRAINT "_pages_v_blocks_statement_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_statement_locales" ADD CONSTRAINT "_pages_v_blocks_statement_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_statement"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_media" ADD CONSTRAINT "_pages_v_blocks_split_media_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_media" ADD CONSTRAINT "_pages_v_blocks_split_media_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_split_media_locales" ADD CONSTRAINT "_pages_v_blocks_split_media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_split_media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text" ADD CONSTRAINT "_pages_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_rich_text_locales" ADD CONSTRAINT "_pages_v_blocks_rich_text_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_rich_text"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid" ADD CONSTRAINT "_pages_v_blocks_product_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_product_grid_locales" ADD CONSTRAINT "_pages_v_blocks_product_grid_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_product_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_tiles" ADD CONSTRAINT "_pages_v_blocks_category_tiles_tiles_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_tiles" ADD CONSTRAINT "_pages_v_blocks_category_tiles_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_category_tiles_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_tiles_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles" ADD CONSTRAINT "_pages_v_blocks_category_tiles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_category_tiles_locales" ADD CONSTRAINT "_pages_v_blocks_category_tiles_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_category_tiles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lead_form" ADD CONSTRAINT "_pages_v_blocks_lead_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lead_form_locales" ADD CONSTRAINT "_pages_v_blocks_lead_form_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lead_form"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sections" ADD CONSTRAINT "sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sections_locales" ADD CONSTRAINT "sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_section_id_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories" ADD CONSTRAINT "categories_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "categories_locales" ADD CONSTRAINT "categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_parent_id_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_version_section_id_sections_id_fk" FOREIGN KEY ("version_section_id") REFERENCES "public"."sections"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v" ADD CONSTRAINT "_categories_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v_locales" ADD CONSTRAINT "_categories_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_categories_v_locales" ADD CONSTRAINT "_categories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "series" ADD CONSTRAINT "series_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "series" ADD CONSTRAINT "series_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "series_locales" ADD CONSTRAINT "series_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_series_v" ADD CONSTRAINT "_series_v_parent_id_series_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_series_v" ADD CONSTRAINT "_series_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_series_v" ADD CONSTRAINT "_series_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_series_v_locales" ADD CONSTRAINT "_series_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_series_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs" ADD CONSTRAINT "products_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specs_locales" ADD CONSTRAINT "products_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs" ADD CONSTRAINT "_products_v_version_specs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specs_locales" ADD CONSTRAINT "_products_v_version_specs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_specs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_category_id_categories_id_fk" FOREIGN KEY ("version_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_series_id_series_id_fk" FOREIGN KEY ("version_series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "orders_items" ADD CONSTRAINT "orders_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sections_fk" FOREIGN KEY ("sections_id") REFERENCES "public"."sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_series_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_orders_fk" FOREIGN KEY ("orders_id") REFERENCES "public"."orders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_nav_links" ADD CONSTRAINT "site_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_nav_links_locales" ADD CONSTRAINT "site_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_socials" ADD CONSTRAINT "site_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_footer_links" ADD CONSTRAINT "site_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_footer_links_locales" ADD CONSTRAINT "site_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_locales" ADD CONSTRAINT "site_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_nav_links" ADD CONSTRAINT "_site_v_version_nav_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_nav_links_locales" ADD CONSTRAINT "_site_v_version_nav_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v_version_nav_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_socials" ADD CONSTRAINT "_site_v_version_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_footer_links" ADD CONSTRAINT "_site_v_version_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_version_footer_links_locales" ADD CONSTRAINT "_site_v_version_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v_version_footer_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_site_v_locales" ADD CONSTRAINT "_site_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_site_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_hero_slides_order_idx" ON "pages_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_slides_parent_id_idx" ON "pages_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_image_idx" ON "pages_blocks_hero_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_hero_slides_locales_locale_parent_id_unique" ON "pages_blocks_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_hero_slides_locales_parent_id_idx" ON "pages_blocks_hero_slides_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_order_idx" ON "pages_blocks_hero" USING btree ("_order");
  CREATE INDEX "pages_blocks_hero_parent_id_idx" ON "pages_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_hero_path_idx" ON "pages_blocks_hero" USING btree ("_path");
  CREATE INDEX "pages_blocks_statement_order_idx" ON "pages_blocks_statement" USING btree ("_order");
  CREATE INDEX "pages_blocks_statement_parent_id_idx" ON "pages_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_statement_path_idx" ON "pages_blocks_statement" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_statement_locales_locale_parent_id_unique" ON "pages_blocks_statement_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_statement_locales_parent_id_idx" ON "pages_blocks_statement_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_media_order_idx" ON "pages_blocks_split_media" USING btree ("_order");
  CREATE INDEX "pages_blocks_split_media_parent_id_idx" ON "pages_blocks_split_media" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_split_media_path_idx" ON "pages_blocks_split_media" USING btree ("_path");
  CREATE INDEX "pages_blocks_split_media_image_idx" ON "pages_blocks_split_media" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_split_media_locales_locale_parent_id_unique" ON "pages_blocks_split_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_split_media_locales_parent_id_idx" ON "pages_blocks_split_media_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_order_idx" ON "pages_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "pages_blocks_rich_text_parent_id_idx" ON "pages_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_rich_text_path_idx" ON "pages_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_rich_text_locales_locale_parent_id_unique" ON "pages_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_rich_text_locales_parent_id_idx" ON "pages_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_grid_order_idx" ON "pages_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "pages_blocks_product_grid_parent_id_idx" ON "pages_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_product_grid_path_idx" ON "pages_blocks_product_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_product_grid_locales_locale_parent_id_unique" ON "pages_blocks_product_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_product_grid_locales_parent_id_idx" ON "pages_blocks_product_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_tiles_order_idx" ON "pages_blocks_category_tiles_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_tiles_tiles_parent_id_idx" ON "pages_blocks_category_tiles_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_tiles_image_idx" ON "pages_blocks_category_tiles_tiles" USING btree ("image_id");
  CREATE UNIQUE INDEX "pages_blocks_category_tiles_tiles_locales_locale_parent_id_u" ON "pages_blocks_category_tiles_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_tiles_locales_parent_id_idx" ON "pages_blocks_category_tiles_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_order_idx" ON "pages_blocks_category_tiles" USING btree ("_order");
  CREATE INDEX "pages_blocks_category_tiles_parent_id_idx" ON "pages_blocks_category_tiles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_path_idx" ON "pages_blocks_category_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_category_tiles_locales_locale_parent_id_unique" ON "pages_blocks_category_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_category_tiles_locales_parent_id_idx" ON "pages_blocks_category_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lead_form_order_idx" ON "pages_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "pages_blocks_lead_form_parent_id_idx" ON "pages_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lead_form_path_idx" ON "pages_blocks_lead_form" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_blocks_lead_form_locales_locale_parent_id_unique" ON "pages_blocks_lead_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_blocks_lead_form_locales_parent_id_idx" ON "pages_blocks_lead_form_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "pages_locales_parent_id_idx" ON "pages_locales" USING btree ("_parent_id");
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_order_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_slides_parent_id_idx" ON "_pages_v_blocks_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_image_idx" ON "_pages_v_blocks_hero_slides" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_hero_slides_locales_locale_parent_id_unique" ON "_pages_v_blocks_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_slides_locales_parent_id_idx" ON "_pages_v_blocks_hero_slides_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_order_idx" ON "_pages_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_hero_parent_id_idx" ON "_pages_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_hero_path_idx" ON "_pages_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_statement_order_idx" ON "_pages_v_blocks_statement" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_statement_parent_id_idx" ON "_pages_v_blocks_statement" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_statement_path_idx" ON "_pages_v_blocks_statement" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_statement_locales_locale_parent_id_unique" ON "_pages_v_blocks_statement_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_statement_locales_parent_id_idx" ON "_pages_v_blocks_statement_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_media_order_idx" ON "_pages_v_blocks_split_media" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_split_media_parent_id_idx" ON "_pages_v_blocks_split_media" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_split_media_path_idx" ON "_pages_v_blocks_split_media" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_split_media_image_idx" ON "_pages_v_blocks_split_media" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_split_media_locales_locale_parent_id_unique" ON "_pages_v_blocks_split_media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_split_media_locales_parent_id_idx" ON "_pages_v_blocks_split_media_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_order_idx" ON "_pages_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_rich_text_parent_id_idx" ON "_pages_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_path_idx" ON "_pages_v_blocks_rich_text" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_rich_text_locales_locale_parent_id_unique" ON "_pages_v_blocks_rich_text_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_rich_text_locales_parent_id_idx" ON "_pages_v_blocks_rich_text_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_order_idx" ON "_pages_v_blocks_product_grid" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_product_grid_parent_id_idx" ON "_pages_v_blocks_product_grid" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_path_idx" ON "_pages_v_blocks_product_grid" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_product_grid_locales_locale_parent_id_unique" ON "_pages_v_blocks_product_grid_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_product_grid_locales_parent_id_idx" ON "_pages_v_blocks_product_grid_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_tiles_order_idx" ON "_pages_v_blocks_category_tiles_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_tiles_tiles_parent_id_idx" ON "_pages_v_blocks_category_tiles_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_tiles_image_idx" ON "_pages_v_blocks_category_tiles_tiles" USING btree ("image_id");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_tiles_tiles_locales_locale_parent_i" ON "_pages_v_blocks_category_tiles_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_tiles_locales_parent_id_idx" ON "_pages_v_blocks_category_tiles_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_order_idx" ON "_pages_v_blocks_category_tiles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_category_tiles_parent_id_idx" ON "_pages_v_blocks_category_tiles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_path_idx" ON "_pages_v_blocks_category_tiles" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_category_tiles_locales_locale_parent_id_uniq" ON "_pages_v_blocks_category_tiles_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_category_tiles_locales_parent_id_idx" ON "_pages_v_blocks_category_tiles_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_order_idx" ON "_pages_v_blocks_lead_form" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lead_form_parent_id_idx" ON "_pages_v_blocks_lead_form" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_path_idx" ON "_pages_v_blocks_lead_form" USING btree ("_path");
  CREATE UNIQUE INDEX "_pages_v_blocks_lead_form_locales_locale_parent_id_unique" ON "_pages_v_blocks_lead_form_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_blocks_lead_form_locales_parent_id_idx" ON "_pages_v_blocks_lead_form_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_locales_parent_id_idx" ON "_pages_v_locales" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_rels_order_idx" ON "_pages_v_rels" USING btree ("order");
  CREATE INDEX "_pages_v_rels_parent_idx" ON "_pages_v_rels" USING btree ("parent_id");
  CREATE INDEX "_pages_v_rels_path_idx" ON "_pages_v_rels" USING btree ("path");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id");
  CREATE INDEX "sections__order_idx" ON "sections" USING btree ("_order");
  CREATE INDEX "sections_image_idx" ON "sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "sections_slug_idx" ON "sections" USING btree ("slug");
  CREATE INDEX "sections_updated_at_idx" ON "sections" USING btree ("updated_at");
  CREATE INDEX "sections_created_at_idx" ON "sections" USING btree ("created_at");
  CREATE UNIQUE INDEX "sections_locales_locale_parent_id_unique" ON "sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "sections_locales_parent_id_idx" ON "sections_locales" USING btree ("_parent_id");
  CREATE INDEX "categories__order_idx" ON "categories" USING btree ("_order");
  CREATE INDEX "categories_section_idx" ON "categories" USING btree ("section_id");
  CREATE INDEX "categories_hero_hero_image_idx" ON "categories" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "categories_slug_idx" ON "categories" USING btree ("slug");
  CREATE INDEX "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX "categories__status_idx" ON "categories" USING btree ("_status");
  CREATE INDEX "categories_meta_meta_image_idx" ON "categories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "categories_locales_locale_parent_id_unique" ON "categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "categories_locales_parent_id_idx" ON "categories_locales" USING btree ("_parent_id");
  CREATE INDEX "_categories_v_parent_idx" ON "_categories_v" USING btree ("parent_id");
  CREATE INDEX "_categories_v_version_version__order_idx" ON "_categories_v" USING btree ("version__order");
  CREATE INDEX "_categories_v_version_version_section_idx" ON "_categories_v" USING btree ("version_section_id");
  CREATE INDEX "_categories_v_version_hero_version_hero_image_idx" ON "_categories_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_categories_v_version_version_slug_idx" ON "_categories_v" USING btree ("version_slug");
  CREATE INDEX "_categories_v_version_version_updated_at_idx" ON "_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_categories_v_version_version_created_at_idx" ON "_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_categories_v_version_version__status_idx" ON "_categories_v" USING btree ("version__status");
  CREATE INDEX "_categories_v_created_at_idx" ON "_categories_v" USING btree ("created_at");
  CREATE INDEX "_categories_v_updated_at_idx" ON "_categories_v" USING btree ("updated_at");
  CREATE INDEX "_categories_v_snapshot_idx" ON "_categories_v" USING btree ("snapshot");
  CREATE INDEX "_categories_v_published_locale_idx" ON "_categories_v" USING btree ("published_locale");
  CREATE INDEX "_categories_v_latest_idx" ON "_categories_v" USING btree ("latest");
  CREATE INDEX "_categories_v_autosave_idx" ON "_categories_v" USING btree ("autosave");
  CREATE INDEX "_categories_v_version_meta_version_meta_image_idx" ON "_categories_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_categories_v_locales_locale_parent_id_unique" ON "_categories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_categories_v_locales_parent_id_idx" ON "_categories_v_locales" USING btree ("_parent_id");
  CREATE INDEX "series__order_idx" ON "series" USING btree ("_order");
  CREATE INDEX "series_category_idx" ON "series" USING btree ("category_id");
  CREATE INDEX "series_image_idx" ON "series" USING btree ("image_id");
  CREATE INDEX "series_updated_at_idx" ON "series" USING btree ("updated_at");
  CREATE INDEX "series_created_at_idx" ON "series" USING btree ("created_at");
  CREATE INDEX "series__status_idx" ON "series" USING btree ("_status");
  CREATE UNIQUE INDEX "series_locales_locale_parent_id_unique" ON "series_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "series_locales_parent_id_idx" ON "series_locales" USING btree ("_parent_id");
  CREATE INDEX "_series_v_parent_idx" ON "_series_v" USING btree ("parent_id");
  CREATE INDEX "_series_v_version_version__order_idx" ON "_series_v" USING btree ("version__order");
  CREATE INDEX "_series_v_version_version_category_idx" ON "_series_v" USING btree ("version_category_id");
  CREATE INDEX "_series_v_version_version_image_idx" ON "_series_v" USING btree ("version_image_id");
  CREATE INDEX "_series_v_version_version_updated_at_idx" ON "_series_v" USING btree ("version_updated_at");
  CREATE INDEX "_series_v_version_version_created_at_idx" ON "_series_v" USING btree ("version_created_at");
  CREATE INDEX "_series_v_version_version__status_idx" ON "_series_v" USING btree ("version__status");
  CREATE INDEX "_series_v_created_at_idx" ON "_series_v" USING btree ("created_at");
  CREATE INDEX "_series_v_updated_at_idx" ON "_series_v" USING btree ("updated_at");
  CREATE INDEX "_series_v_snapshot_idx" ON "_series_v" USING btree ("snapshot");
  CREATE INDEX "_series_v_published_locale_idx" ON "_series_v" USING btree ("published_locale");
  CREATE INDEX "_series_v_latest_idx" ON "_series_v" USING btree ("latest");
  CREATE INDEX "_series_v_autosave_idx" ON "_series_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_series_v_locales_locale_parent_id_unique" ON "_series_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_series_v_locales_parent_id_idx" ON "_series_v_locales" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_specs_order_idx" ON "products_specs" USING btree ("_order");
  CREATE INDEX "products_specs_parent_id_idx" ON "products_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "products_specs_locales_locale_parent_id_unique" ON "products_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specs_locales_parent_id_idx" ON "products_specs_locales" USING btree ("_parent_id");
  CREATE INDEX "products__order_idx" ON "products" USING btree ("_order");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_category_idx" ON "products" USING btree ("category_id");
  CREATE INDEX "products_series_idx" ON "products" USING btree ("series_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_locales_parent_id_idx" ON "products_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_image_idx" ON "_products_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_version_specs_order_idx" ON "_products_v_version_specs" USING btree ("_order");
  CREATE INDEX "_products_v_version_specs_parent_id_idx" ON "_products_v_version_specs" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_products_v_version_specs_locales_locale_parent_id_unique" ON "_products_v_version_specs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specs_locales_parent_id_idx" ON "_products_v_version_specs_locales" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version__order_idx" ON "_products_v" USING btree ("version__order");
  CREATE INDEX "_products_v_version_version_image_idx" ON "_products_v" USING btree ("version_image_id");
  CREATE INDEX "_products_v_version_version_category_idx" ON "_products_v" USING btree ("version_category_id");
  CREATE INDEX "_products_v_version_version_series_idx" ON "_products_v" USING btree ("version_series_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_locales_parent_id_idx" ON "_products_v_locales" USING btree ("_parent_id");
  CREATE INDEX "orders_items_order_idx" ON "orders_items" USING btree ("_order");
  CREATE INDEX "orders_items_parent_id_idx" ON "orders_items" USING btree ("_parent_id");
  CREATE INDEX "orders_items_product_idx" ON "orders_items" USING btree ("product_id");
  CREATE INDEX "orders_updated_at_idx" ON "orders" USING btree ("updated_at");
  CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumb_sizes_thumb_filename_idx" ON "media" USING btree ("sizes_thumb_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_locales_parent_id_idx" ON "media_locales" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_sections_id_idx" ON "payload_locked_documents_rels" USING btree ("sections_id");
  CREATE INDEX "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX "payload_locked_documents_rels_series_id_idx" ON "payload_locked_documents_rels" USING btree ("series_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_orders_id_idx" ON "payload_locked_documents_rels" USING btree ("orders_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_nav_links_order_idx" ON "site_nav_links" USING btree ("_order");
  CREATE INDEX "site_nav_links_parent_id_idx" ON "site_nav_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_nav_links_locales_locale_parent_id_unique" ON "site_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_nav_links_locales_parent_id_idx" ON "site_nav_links_locales" USING btree ("_parent_id");
  CREATE INDEX "site_socials_order_idx" ON "site_socials" USING btree ("_order");
  CREATE INDEX "site_socials_parent_id_idx" ON "site_socials" USING btree ("_parent_id");
  CREATE INDEX "site_footer_links_order_idx" ON "site_footer_links" USING btree ("_order");
  CREATE INDEX "site_footer_links_parent_id_idx" ON "site_footer_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_footer_links_locales_locale_parent_id_unique" ON "site_footer_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_footer_links_locales_parent_id_idx" ON "site_footer_links_locales" USING btree ("_parent_id");
  CREATE INDEX "site__status_idx" ON "site" USING btree ("_status");
  CREATE UNIQUE INDEX "site_locales_locale_parent_id_unique" ON "site_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_locales_parent_id_idx" ON "site_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_nav_links_order_idx" ON "_site_v_version_nav_links" USING btree ("_order");
  CREATE INDEX "_site_v_version_nav_links_parent_id_idx" ON "_site_v_version_nav_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_v_version_nav_links_locales_locale_parent_id_unique" ON "_site_v_version_nav_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_v_version_nav_links_locales_parent_id_idx" ON "_site_v_version_nav_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_socials_order_idx" ON "_site_v_version_socials" USING btree ("_order");
  CREATE INDEX "_site_v_version_socials_parent_id_idx" ON "_site_v_version_socials" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_footer_links_order_idx" ON "_site_v_version_footer_links" USING btree ("_order");
  CREATE INDEX "_site_v_version_footer_links_parent_id_idx" ON "_site_v_version_footer_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_site_v_version_footer_links_locales_locale_parent_id_unique" ON "_site_v_version_footer_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_v_version_footer_links_locales_parent_id_idx" ON "_site_v_version_footer_links_locales" USING btree ("_parent_id");
  CREATE INDEX "_site_v_version_version__status_idx" ON "_site_v" USING btree ("version__status");
  CREATE INDEX "_site_v_created_at_idx" ON "_site_v" USING btree ("created_at");
  CREATE INDEX "_site_v_updated_at_idx" ON "_site_v" USING btree ("updated_at");
  CREATE INDEX "_site_v_snapshot_idx" ON "_site_v" USING btree ("snapshot");
  CREATE INDEX "_site_v_published_locale_idx" ON "_site_v" USING btree ("published_locale");
  CREATE INDEX "_site_v_latest_idx" ON "_site_v" USING btree ("latest");
  CREATE INDEX "_site_v_autosave_idx" ON "_site_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_site_v_locales_locale_parent_id_unique" ON "_site_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_site_v_locales_parent_id_idx" ON "_site_v_locales" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_hero_slides" CASCADE;
  DROP TABLE "pages_blocks_hero_slides_locales" CASCADE;
  DROP TABLE "pages_blocks_hero" CASCADE;
  DROP TABLE "pages_blocks_statement" CASCADE;
  DROP TABLE "pages_blocks_statement_locales" CASCADE;
  DROP TABLE "pages_blocks_split_media" CASCADE;
  DROP TABLE "pages_blocks_split_media_locales" CASCADE;
  DROP TABLE "pages_blocks_rich_text" CASCADE;
  DROP TABLE "pages_blocks_rich_text_locales" CASCADE;
  DROP TABLE "pages_blocks_product_grid" CASCADE;
  DROP TABLE "pages_blocks_product_grid_locales" CASCADE;
  DROP TABLE "pages_blocks_category_tiles_tiles" CASCADE;
  DROP TABLE "pages_blocks_category_tiles_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_category_tiles" CASCADE;
  DROP TABLE "pages_blocks_category_tiles_locales" CASCADE;
  DROP TABLE "pages_blocks_lead_form" CASCADE;
  DROP TABLE "pages_blocks_lead_form_locales" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "pages_rels" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides" CASCADE;
  DROP TABLE "_pages_v_blocks_hero_slides_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_hero" CASCADE;
  DROP TABLE "_pages_v_blocks_statement" CASCADE;
  DROP TABLE "_pages_v_blocks_statement_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_split_media" CASCADE;
  DROP TABLE "_pages_v_blocks_split_media_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text" CASCADE;
  DROP TABLE "_pages_v_blocks_rich_text_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid" CASCADE;
  DROP TABLE "_pages_v_blocks_product_grid_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles" CASCADE;
  DROP TABLE "_pages_v_blocks_category_tiles_locales" CASCADE;
  DROP TABLE "_pages_v_blocks_lead_form" CASCADE;
  DROP TABLE "_pages_v_blocks_lead_form_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "_pages_v_rels" CASCADE;
  DROP TABLE "sections" CASCADE;
  DROP TABLE "sections_locales" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_locales" CASCADE;
  DROP TABLE "_categories_v" CASCADE;
  DROP TABLE "_categories_v_locales" CASCADE;
  DROP TABLE "series" CASCADE;
  DROP TABLE "series_locales" CASCADE;
  DROP TABLE "_series_v" CASCADE;
  DROP TABLE "_series_v_locales" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_specs" CASCADE;
  DROP TABLE "products_specs_locales" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "_products_v_version_gallery" CASCADE;
  DROP TABLE "_products_v_version_specs" CASCADE;
  DROP TABLE "_products_v_version_specs_locales" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "orders_items" CASCADE;
  DROP TABLE "orders" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_nav_links" CASCADE;
  DROP TABLE "site_nav_links_locales" CASCADE;
  DROP TABLE "site_socials" CASCADE;
  DROP TABLE "site_footer_links" CASCADE;
  DROP TABLE "site_footer_links_locales" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "site_locales" CASCADE;
  DROP TABLE "_site_v_version_nav_links" CASCADE;
  DROP TABLE "_site_v_version_nav_links_locales" CASCADE;
  DROP TABLE "_site_v_version_socials" CASCADE;
  DROP TABLE "_site_v_version_footer_links" CASCADE;
  DROP TABLE "_site_v_version_footer_links_locales" CASCADE;
  DROP TABLE "_site_v" CASCADE;
  DROP TABLE "_site_v_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_pages_blocks_statement_theme";
  DROP TYPE "public"."enum_pages_blocks_split_media_image_position";
  DROP TYPE "public"."enum_pages_blocks_split_media_theme";
  DROP TYPE "public"."enum_pages_blocks_rich_text_width";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_blocks_statement_theme";
  DROP TYPE "public"."enum__pages_v_blocks_split_media_image_position";
  DROP TYPE "public"."enum__pages_v_blocks_split_media_theme";
  DROP TYPE "public"."enum__pages_v_blocks_rich_text_width";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_categories_status";
  DROP TYPE "public"."enum__categories_v_version_status";
  DROP TYPE "public"."enum__categories_v_published_locale";
  DROP TYPE "public"."enum_series_status";
  DROP TYPE "public"."enum__series_v_version_status";
  DROP TYPE "public"."enum__series_v_published_locale";
  DROP TYPE "public"."enum_products_badge";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_badge";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_orders_status";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_site_socials_network";
  DROP TYPE "public"."enum_site_status";
  DROP TYPE "public"."enum__site_v_version_socials_network";
  DROP TYPE "public"."enum__site_v_version_status";
  DROP TYPE "public"."enum__site_v_published_locale";`)
}
