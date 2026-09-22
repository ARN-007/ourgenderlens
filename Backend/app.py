from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

import os
import uuid


# =========================================================
# LOAD ENVIRONMENT VARIABLES
# =========================================================

load_dotenv()


# =========================================================
# FLASK APP
# =========================================================

app = Flask(__name__)


# =========================================================
# CORS
# =========================================================

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": "*",
            "allow_headers": [
                "Content-Type"
            ],
            "methods": [
                "GET",
                "POST",
                "PUT",
                "DELETE",
                "OPTIONS"
            ]
        }
    }
)


# =========================================================
# SUPABASE CONFIGURATION
# =========================================================

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")


if not SUPABASE_URL:
    raise RuntimeError(
        "SUPABASE_URL is missing from .env"
    )


if not SUPABASE_KEY:
    raise RuntimeError(
        "SUPABASE_KEY is missing from .env"
    )


supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)


# =========================================================
# STORAGE CONFIGURATION
# =========================================================

STORAGE_BUCKET = "resources"

# Signed URL validity
SIGNED_URL_EXPIRY = 3600


# =========================================================
# HELPER — CREATE SIGNED URL
# =========================================================

def create_signed_url(file_path):

    if not file_path:
        return None

    try:

        response = (
            supabase
            .storage
            .from_(STORAGE_BUCKET)
            .create_signed_url(
                file_path,
                SIGNED_URL_EXPIRY
            )
        )

        # -------------------------------------------------
        # Supabase SDK versions can return the signed URL
        # in slightly different structures.
        # -------------------------------------------------

        if isinstance(response, dict):

            if "signedURL" in response:
                return response["signedURL"]

            if "signedUrl" in response:
                return response["signedUrl"]

            if "signed_url" in response:
                return response["signed_url"]

            if "data" in response:

                data = response["data"]

                if isinstance(data, dict):

                    return (
                        data.get("signedURL")
                        or data.get("signedUrl")
                        or data.get("signed_url")
                    )

        return None

    except Exception as error:

        print(
            "SIGNED URL ERROR:",
            error
        )

        return None


# =========================================================
# GET ALL RESOURCES
# =========================================================
#
# PUBLIC ENDPOINT
#
# Anyone can read resources.
#
# =========================================================

@app.route(
    "/api/resources",
    methods=["GET"]
)
def get_resources():

    try:

        response = (
            supabase
            .table("resources")
            .select("*")
            .execute()
        )

        resources = response.data or []


        # -------------------------------------------------
        # Generate fresh signed URL for each document
        # -------------------------------------------------

        for resource in resources:

            file_path = resource.get(
                "file_url"
            )

            if file_path:

                resource[
                    "file_access_url"
                ] = create_signed_url(
                    file_path
                )

            else:

                resource[
                    "file_access_url"
                ] = None


        return jsonify(
            resources
        )


    except Exception as error:

        print(
            "GET RESOURCES ERROR:",
            error
        )

        return jsonify({
            "error": "Failed to load resources",
            "details": str(error)
        }), 500


# =========================================================
# CREATE RESOURCE
# =========================================================
#
# NO AUTHENTICATION
#
# =========================================================

@app.route(
    "/api/resources",
    methods=["POST"]
)
def create_resource():

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "error": "Request body is required"
            }), 400


        title = data.get("title")
        resource_type = data.get("type")
        description = data.get("description")
        author = data.get("author")
        publication_date = data.get(
            "publication_date"
        )
        file_url = data.get("file_url")
        image_url = data.get("image_url")
        status = data.get(
            "status",
            "published"
        )


        # -------------------------------------------------
        # REQUIRED FIELD
        # -------------------------------------------------

        if not title:

            return jsonify({
                "error": "Title is required"
            }), 400


        # -------------------------------------------------
        # CREATE DATABASE RECORD
        # -------------------------------------------------

        resource_data = {

            "title": title,

            "type": resource_type,

            "description": description,

            "author": author,

            "publication_date":
                publication_date,

            "file_url": file_url,

            "image_url": image_url,

            "status": status
        }


        response = (
            supabase
            .table("resources")
            .insert(resource_data)
            .execute()
        )


        created_resource = (
            response.data[0]
            if response.data
            else None
        )


        if not created_resource:

            return jsonify({
                "error":
                    "Resource was not created"
            }), 500


        # -------------------------------------------------
        # ADD SIGNED URL
        # -------------------------------------------------

        file_path = created_resource.get(
            "file_url"
        )

        if file_path:

            created_resource[
                "file_access_url"
            ] = create_signed_url(
                file_path
            )

        else:

            created_resource[
                "file_access_url"
            ] = None


        return jsonify({
            "success": True,
            "message":
                "Resource created successfully",
            "resource":
                created_resource
        }), 201


    except Exception as error:

        print(
            "CREATE RESOURCE ERROR:",
            error
        )

        return jsonify({
            "error":
                "Failed to create resource",
            "details":
                str(error)
        }), 500


# =========================================================
# UPLOAD RESOURCE FILE
# =========================================================
#
# NO AUTHENTICATION
#
# Uploads a file to Supabase Storage and returns
# the storage path.
#
# =========================================================

@app.route(
    "/api/resources/upload",
    methods=["POST"]
)
def upload_resource():

    try:

        if "file" not in request.files:

            return jsonify({
                "error":
                    "No file provided"
            }), 400


        file = request.files["file"]


        if not file:

            return jsonify({
                "error":
                    "Invalid file"
            }), 400


        if not file.filename:

            return jsonify({
                "error":
                    "Filename is required"
            }), 400


        # -------------------------------------------------
        # SECURE FILE NAME
        # -------------------------------------------------

        original_filename = secure_filename(
            file.filename
        )


        if not original_filename:

            return jsonify({
                "error":
                    "Invalid filename"
            }), 400


        # -------------------------------------------------
        # CREATE UNIQUE STORAGE PATH
        # -------------------------------------------------

        extension = ""

        if "." in original_filename:

            extension = (
                original_filename
                .rsplit(".", 1)[1]
                .lower()
            )


        unique_name = str(
            uuid.uuid4()
        )


        if extension:

            unique_name += (
                "." + extension
            )


        storage_path = (
            "uploads/"
            + unique_name
        )


        # -------------------------------------------------
        # READ FILE
        # -------------------------------------------------

        file_data = file.read()


        if not file_data:

            return jsonify({
                "error":
                    "File is empty"
            }), 400


        # -------------------------------------------------
        # CONTENT TYPE
        # -------------------------------------------------

        content_type = (
            file.content_type
            or "application/octet-stream"
        )


        # -------------------------------------------------
        # UPLOAD TO SUPABASE STORAGE
        # -------------------------------------------------

        response = (
            supabase
            .storage
            .from_(STORAGE_BUCKET)
            .upload(
                storage_path,
                file_data,
                {
                    "content-type":
                        content_type
                }
            )
        )


        print(
            "STORAGE UPLOAD RESPONSE:",
            response
        )


        # -------------------------------------------------
        # RETURN STORAGE PATH
        # -------------------------------------------------

        return jsonify({

            "success": True,

            "message":
                "File uploaded successfully",

            "file_url":
                storage_path

        }), 201


    except Exception as error:

        print(
            "UPLOAD RESOURCE ERROR:",
            error
        )

        return jsonify({

            "error":
                "Failed to upload file",

            "details":
                str(error)

        }), 500


# =========================================================
# UPDATE RESOURCE
# =========================================================
#
# NO AUTHENTICATION
#
# =========================================================

@app.route(
    "/api/resources/<resource_id>",
    methods=["PUT"]
)
def update_resource(resource_id):

    try:

        data = request.get_json()

        if not data:

            return jsonify({
                "error":
                    "Request body is required"
            }), 400


        # -------------------------------------------------
        # ALLOWED FIELDS
        # -------------------------------------------------

        allowed_fields = [

            "title",

            "type",

            "description",

            "author",

            "publication_date",

            "file_url",

            "image_url",

            "status"
        ]


        update_data = {}


        for field in allowed_fields:

            if field in data:

                update_data[field] = (
                    data[field]
                )


        if not update_data:

            return jsonify({
                "error":
                    "No fields to update"
            }), 400


        # -------------------------------------------------
        # UPDATE DATABASE
        # -------------------------------------------------

        response = (
            supabase
            .table("resources")
            .update(update_data)
            .eq("id", resource_id)
            .execute()
        )


        updated_resource = (
            response.data[0]
            if response.data
            else None
        )


        if not updated_resource:

            return jsonify({
                "error":
                    "Resource not found"
            }), 404


        # -------------------------------------------------
        # CREATE FRESH SIGNED URL
        # -------------------------------------------------

        file_path = updated_resource.get(
            "file_url"
        )

        if file_path:

            updated_resource[
                "file_access_url"
            ] = create_signed_url(
                file_path
            )

        else:

            updated_resource[
                "file_access_url"
            ] = None


        return jsonify({

            "success": True,

            "message":
                "Resource updated successfully",

            "resource":
                updated_resource

        })


    except Exception as error:

        print(
            "UPDATE RESOURCE ERROR:",
            error
        )

        return jsonify({

            "error":
                "Failed to update resource",

            "details":
                str(error)

        }), 500


# =========================================================
# DELETE RESOURCE
# =========================================================
#
# NO AUTHENTICATION
#
# Deletes the database record.
#
# If the resource has a file in Supabase Storage,
# the file is also removed.
#
# =========================================================

@app.route(
    "/api/resources/<resource_id>",
    methods=["DELETE"]
)
def delete_resource(resource_id):

    try:

        # -------------------------------------------------
        # GET RESOURCE FIRST
        # -------------------------------------------------

        existing_response = (
            supabase
            .table("resources")
            .select("*")
            .eq("id", resource_id)
            .execute()
        )


        existing_resources = (
            existing_response.data or []
        )


        if not existing_resources:

            return jsonify({
                "error":
                    "Resource not found"
            }), 404


        resource = (
            existing_resources[0]
        )


        file_path = resource.get(
            "file_url"
        )


        # -------------------------------------------------
        # DELETE DATABASE RECORD
        # -------------------------------------------------

        delete_response = (
            supabase
            .table("resources")
            .delete()
            .eq("id", resource_id)
            .execute()
        )


        # -------------------------------------------------
        # DELETE FILE FROM STORAGE
        # -------------------------------------------------

        if file_path:

            try:

                storage_response = (
                    supabase
                    .storage
                    .from_(STORAGE_BUCKET)
                    .remove([
                        file_path
                    ])
                )

                print(
                    "STORAGE DELETE RESPONSE:",
                    storage_response
                )

            except Exception as storage_error:

                print(
                    "STORAGE DELETE ERROR:",
                    storage_error
                )

                # -------------------------------------------------
                # Do not fail the database deletion if the
                # storage file could not be removed.
                # -------------------------------------------------


        return jsonify({

            "success": True,

            "message":
                "Resource deleted successfully"

        })


    except Exception as error:

        print(
            "DELETE RESOURCE ERROR:",
            error
        )

        return jsonify({

            "error":
                "Failed to delete resource",

            "details":
                str(error)

        }), 500


# =========================================================
# HEALTH CHECK
# =========================================================

@app.route(
    "/api/health",
    methods=["GET"]
)
def health_check():

    return jsonify({

        "success": True,

        "message":
            "OGL backend is running",

        "supabase":
            bool(SUPABASE_URL and SUPABASE_KEY)

    })


# =========================================================
# ROOT
# =========================================================

@app.route(
    "/",
    methods=["GET"]
)
def home():

    return jsonify({

        "success": True,

        "message":
            "Our Gender Lens API",

        "endpoints": {

            "resources":
                "/api/resources",

            "upload":
                "/api/resources/upload",

            "health":
                "/api/health"

        }

    })


# =========================================================
# RUN SERVER
# =========================================================

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )