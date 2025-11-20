# 🧭 CONTEXTO DE ARQUITECTURA Y DESARROLLO

Este proyecto Angular Versión 20 está en proceso de **transición hacia una arquitectura Feature-Based + Layered**.  
La estructura actual puede no reflejar este patrón, pero **a partir de ahora toda nueva implementación, refactor o feature debe seguir esta arquitectura.**

---

## ⚙️ OBJETIVO

- Estandarizar la estructura del proyecto bajo una arquitectura **Feature-Based + Layered**.
- Organizar el código por **features** y **capas** (no por tipo de archivo).
- Promover **modularidad**, **reutilización** y **mantenibilidad**.
- Mantener **consistencia visual y técnica** con los estilos y componentes existentes.

---

## 🧱 NUEVA ESTRUCTURA DE REFERENCIA

src/
└─ app/
   ├─ core/         → Servicios globales, interceptors, guards, APIs base
   ├─ shared/       → Componentes, pipes, directivas y utilidades reutilizables
   ├─ features/     → Cada feature autocontenible
   │  ├─ users/
   │  ├─ roles/
   │  └─ permissions/
   ├─ layouts/      → Shells y vistas maestras
   └─ app.routes.ts → Rutas principales con lazy-loading directo a componentes standalone


---

## 🧩 CAPAS Y PATRONES

Cada **feature** debe estructurarse así:

features/<feature>/
├─ data-access/      → Servicios HTTP, repositories, adaptadores de datos
│  ├─ <feature>.service.ts
│  └─ <feature>.repository.ts
├─ domain/           → Modelos e interfaces de dominio
│  └─ <feature>.model.ts
├─ application/      → Facades, casos de uso, coordinación de lógica
│  └─ <feature>.facade.ts
├─ ui/
│  ├─ containers/    → Smart components (manejan estado y lógica, standalone)
│  └─ components/    → Dumb components (solo presentación, standalone)
└─ <feature>-routing.ts → Lazy-loaded routes apuntando a los componentes standalone



**Patrones clave:**
- **Dependency Injection** (Angular nativo)
- **Facade / Repository Pattern**
- **Smart/Dumb Components**
- **Lazy Loading + Routing encapsulado**
- **ChangeDetectionStrategy.OnPush**
- **Uso de async pipe y Signals cuando corresponda**

---

## 🧠 LINEAMIENTOS DE DESARROLLO

- A partir de ahora, **todas las nuevas features y refactors deben seguir este patrón.**
- El código existente puede conservarse, pero se migrará progresivamente.
- Los servicios globales deben moverse a `/core`.
- Los componentes reutilizables deben moverse a `/shared`.
- Cada feature debe ser un módulo autocontenible bajo `/features`.

---

## 🎨 ESTILOS Y UI

- El proyecto ya tiene un diseño visual y UX definidos.  
  Copilot debe **mantener coherencia visual** con los componentes y estilos existentes.
- Si no se identifica dónde están los estilos globales, asumir:
  - Estilos globales en `src/styles.scss` (o `src/styles.css`)
  - Componentes visuales reutilizables en `/shared/`
- Nuevos componentes deben reutilizar los estilos existentes (no inventar nuevos).
- Si se usa Angular Material, respetar la paleta de colores y tipografía actual.

---

## 🧩 FEATURES INICIALES

### `users`
- Routing lazy-loaded bajo `/users`
- `UsersFacade`, `UsersService`, `UsersRepository`
- Componentes:
  - Smart: `users-page`
  - Dumb: `user-list`, `user-card`, `user-detail`

### `roles`
- Routing bajo `/roles`
- `RolesFacade`, `RolesService`, `RolesRepository`
- Componentes:
  - Smart: `roles-page`
  - Dumb: `role-list`, `role-item`

### `permissions`
- Routing bajo `/permissions`
- `PermissionsFacade`, `PermissionsService`, `PermissionsRepository`
- Componentes:
  - Smart: `permissions-page`
  - Dumb: `permission-list`, `permission-item`

---

## 🧰 NORMAS PARA COPILOT

Cuando Copilot genere nuevo código, debe:

1. **Seguir la estructura y los nombres definidos arriba.**
2. **Respetar los patrones Smart/Dumb, Facade y Repository.**
3. **Evitar duplicar lógica o servicios existentes.**
4. **Usar OnPush y async pipe.**
5. **Incluir imports correctos en cada módulo.**
6. **Mantener coherencia visual con los componentes existentes.**
7. **Documentar el propósito de clases y métodos con comentarios claros.**
8. **Si detecta una arquitectura anterior diferente, sugerir migración progresiva.**

---

## 💬 USO CON GITHUB COPILOT CHAT

Cuando trabajes con Copilot Chat en VS Code:

**Para crear una nueva feature:**
> Lee el contexto de `COPILOT_CONTEXT.md` y crea la feature `users` con su estructura base, siguiendo el patrón indicado.

**Para migrar código existente:**
> Refactoriza el módulo `app` actual para seguir el patrón Feature-Based + Layered según `COPILOT_CONTEXT.md`.

**Para mantener consistencia visual:**
> Usa los estilos y componentes existentes en `/shared` o los que detectes en `src/styles.scss`.

---

✳️ **NOTA IMPORTANTE:**  
El proyecto puede no tener todavía esta estructura, pero este documento define el **nuevo estándar oficial** a seguir desde ahora.  
Copilot debe asumir que esta arquitectura es la fuente de verdad para todas las nuevas implementaciones y refactors.

