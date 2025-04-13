from sqlalchemy.future import select
from sqlalchemy import text
from database.base import get_db
from fastapi import HTTPException
import datetime

class DeviceSessionService:

	# Get secret key by device_session_id and user_id
	async def get_secret_key(device_session_id: str, user_id: str) -> str:
		async for db in get_db():
			try:
				query = text(
						"SELECT * FROM device_session WHERE id = :device_session_id AND user_id = :user_id"
				)
				result = await db.execute(query, {"device_session_id": device_session_id, "user_id": user_id})
				device_session = result.fetchone()

				# Check device_session valid
				if not device_session or device_session.expired_at < datetime.datetime.utcnow():
					raise HTTPException(
						status_code=404,
						detail="Not found session login user"
					)


				# return secret_key
				return device_session.secret_key

			except HTTPException as http_exc:
				raise http_exc
			except Exception as e:
					raise HTTPException(
						status_code=500,
						detail="Error authorization"
					)