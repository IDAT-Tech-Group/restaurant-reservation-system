import os

controller_path = r"C:\xampp\htdocs\apiRestaurante\app\Http\Controllers\ReservationController.php"
api_path = r"C:\xampp\htdocs\apiRestaurante\routes\api.php"

# 1. Update ReservationController.php
with open(controller_path, "r", encoding="utf-8") as f:
    content = f.read()

disponibilidad_method = """
    public function disponibilidad(Request $request)
    {
        $query = Reservation::select('table_id', 'date', 'start_time', 'end_time')
            ->where('status', '!=', 'cancelado');
            
        if ($request->has('date')) {
            $query->where('date', $request->date);
        }

        return response()->json($query->get());
    }
"""

# Insert before public function destroy
if "public function destroy" in content:
    content = content.replace("    public function destroy($id)", disponibilidad_method + "\n    public function destroy($id)")
else:
    # Just append before the last brace
    content = content[:content.rfind("}")] + disponibilidad_method + "\n}"

with open(controller_path, "w", encoding="utf-8") as f:
    f.write(content)


# 2. Update api.php
with open(api_path, "r", encoding="utf-8") as f:
    api_content = f.read()

# Insert before Route::post('/reservas'
api_content = api_content.replace(
    "Route::post('/reservas', [ReservationController::class, 'store']);",
    "Route::get('/disponibilidad', [ReservationController::class, 'disponibilidad']);\nRoute::post('/reservas', [ReservationController::class, 'store']);"
)

with open(api_path, "w", encoding="utf-8") as f:
    f.write(api_content)

print("Backend patched for disponibilidad!")
