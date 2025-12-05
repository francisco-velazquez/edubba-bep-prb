-- 1. Crear el ENUM para los roles de la aplicación
CREATE TYPE public.app_role AS ENUM ('admin', 'maestro', 'alumno');

-- 2. Crear la tabla de Perfiles (Contiene datos de negocio y la FK al Grado Académico)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    current_grade_id INT, -- CAMBIO: Campo agregado para la lógica de Alumnos
    is_active BOOLEAN DEFAULT TRUE, -- Campo para el borrado lógico
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Crear la tabla user_roles (Para asignar los roles definidos)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'alumno',
    UNIQUE (user_id, role)
);

-- 4. Tabla de Grados Académicos
CREATE TABLE public.academic_grades (
    id SERIAL PRIMARY KEY, 
    name VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- 5. Tabla de Asignaturas
CREATE TABLE public.subjects (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    grade_id INT NOT NULL REFERENCES public.academic_grades(id),
    is_active BOOLEAN DEFAULT TRUE
);

-- 6. Tabla intermedia para asignar Maestros a Asignaturas
CREATE TABLE public.teacher_subjects (
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id INT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    PRIMARY KEY (teacher_id, subject_id)
);

-- 7. Tabla de Módulos (pertenece a una Asignatura)
CREATE TABLE public.modules (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    subject_id INT NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE
);

-- 8. Tabla de Capítulos (pertenece a un Módulo y contiene el contenido)
CREATE TABLE public.chapters (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    module_id INT NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
    video_url VARCHAR(255), -- Enlace al video
    content_url VARCHAR(255), -- Enlace al PDF/Presentación
    order_index INT DEFAULT 0,
    is_published BOOLEAN DEFAULT FALSE
);

-- 9. Tabla de Exámenes (pertenece a un Capítulo)
CREATE TABLE public.exams (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    chapter_id INT NOT NULL REFERENCES public.chapters(id) ON DELETE CASCADE
);

-- 10. Tabla de Preguntas (pertenece a un Examen)
CREATE TABLE public.questions (
    id SERIAL PRIMARY KEY,
    exam_id INT NOT NULL REFERENCES public.exams(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('multiple_choice', 'true_false'))
);

-- 11. Tabla de Opciones (contiene la respuesta correcta para la autoevaluación)
CREATE TABLE public.options (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE
);

-- Habilitar RLS en las tablas de Perfil y Roles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Función para verificar si un usuario tiene un rol específico
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Función para obtener el rol de un usuario
CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
  LIMIT 1
$$;

-- Políticas RLS básicas (Permitir a los usuarios ver y actualizar su propio perfil/rol)

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can view own role"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Política RLS: Los Admins pueden gestionar todos los roles
CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Función Trigger para crear el perfil y asignar el rol por defecto (alumno)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  
  -- Asignación del rol por defecto (alumno)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'alumno');
  
  RETURN NEW;
END;
$$;

-- Crear el Trigger que se ejecuta después de que un usuario se registra en Auth
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();