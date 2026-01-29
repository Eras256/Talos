# Documentación Técnica Detallada - Talos AgentFi Protocol

**Versión del Protocolo:** 1.0.0 (Testnet/Mainnet Ready)
**Fecha de Actualización:** Enero 2026
**Blockchain:** Sui Network (Move 2024 Edition)

---

## 1. Visión General del Sistema

Talos es una plataforma **SaaS DeFi No Custodial** que permite a los usuarios desplegar "Bóvedas Inteligentes" (Smart Vaults) gestionadas por Agentes de IA autónomos.
El sistema utiliza el patrón **Account Abstraction** y **Hot Potato (Flash Receipt)** para garantizar que los agentes solo puedan ejecutar lógica rentable sin tener nunca la capacidad de retirar fondos maliciosamente.

### 1.1 Arquitectura de Alto Nivel

1.  **Capa de Usuario (Frontend):** Interfaz Web3 construida en Next.js 15 que permite suscripciones, monitoreo y despliegue de bóvedas.
2.  **Capa de Acceso (Subscription Registry):** Smart Contract que gestiona los pagos (SaaS) y autoriza la ejecución de los agentes.
3.  **Capa de Ejecución (Smart Vaults):** Bóvedas personales donde residen los fondos. Solo el OwnerCap (Usuario) puede retirar. El AgentCap (Worker) solo puede hacer "Flash Loans" para ejecutar estrategias.
4.  **Capa de Infraestructura (Worker):** Servicio off-chain (Node.js) que escanea la red, encuentra oportunidades de arbitraje y construye Transaction Blocks (PTBs) atómicos.

---

## 2. Smart Contracts (`move/sources`)

### Módulo 1: `talos::subscription` (Monetización)

Este módulo controla el acceso al protocolo mediante un modelo de suscripción pagada en SUI.

*   **Estructura `SubscriptionRegistry` (Shared Object):**
    *   Almacena el mapeo `Table<address, UserSubscription>`.
    *   Acumula los fondos de las suscripciones (`Balance<SUI>`).
*   **Niveles de Servicio (Tiers):**
    *   `Block 1` (Hobbyist): 5 SUI.
    *   `Block 2` (Pro): 25 SUI.
    *   `Block 3` (Whale): 150 SUI.
*   **Función `subscribe`:**
    *   Acepta pago en SUI.
    *   Calcula o extiende la fecha de expiración (`now + 30 days`).
    *   Emite `SubscriptionEvent`.
*   **Función `check_access`:**
    *   Usada por las Bóvedas para validar que el dueño tenga una suscripción activa antes de permitir un Flash Loan.

### Módulo 2: `talos::vault` (Seguridad y Bóvedas)

El núcleo de seguridad del protocolo. Implementa una separación estricta de poderes.

*   **Objetos de Capacidad:**
    *   `OwnerCap` (Store/Key): Control total. Permite retirar fondos (`withdraw`). Se entrega al usuario.
    *   `AgentCap` (Store/Key): Control limitado. Solo permite `borrow_flash`. Se entrega al Worker.
*   **Objeto `Vault` (Shared):**
    *   Contiene un `Bag` dinámico para soportar cualquier moneda (SUI, USDC, CETUS...).
    *   Tiene un flag `is_frozen` para pausar operaciones de emergencia.
*   **Patrón "Hot Potato" (Flash Receipt):**
    *   **Paso 1 `borrow_flash`:** El Agente pide fondos. El contrato verifica la suscripción y emite los fondos + un `FlashReceipt`.
    *   **Paso intermedio (Off-chain logic):** El PTB usa los fondos para hacer swaps en DEXs (Cetus, DeepBook).
    *   **Paso 2 `repay_flash`:** El Agente devuelve los fondos + el `FlashReceipt`.
    *   **Seguridad:** Como `FlashReceipt` no tiene `drop` ni `store`, la transacción **falla atómicamente** si no se llama a `repay_flash` en el mismo bloque con la cantidad correcta (Principal + Profit >= Prestado).

---

## 3. Infraestructura Backend (Worker)

El "Cerebro" que opera las bóvedas. Ubicado en `backend/src/worker.ts`.

*   **Modo Híbrido (Testnet/Mainnet Switch):**
    *   Lee la variable `TESTNET_MODE`.
    *   **True:** Ejecuta una simulación de arbitraje (Mock Swap) que mantiene los fondos para satisfacer el `repay_flash` sin liquidez real.
    *   **False:** Prepara la integración con el **7K Aggregator SDK** para routing real en Mainnet.
*   **Ciclo de Trabajo:**
    1.  Poll de `AgentCap` objects que pertenecen al Worker.
    2.  Para cada Cap, identifica la Bóveda asociada.
    3.  Construye el PTB (Borrow -> Swap -> Repay).
    4.  Firma y ejecuta la transacción.

---

## 4. Frontend (Experiencia de Usuario)

Interfaz moderna construida con el diseño "Neural Glass" (Obsidian + Neon Gradients).

*   **Hooks Clave (`useTalos`):**
    *   Abstrae la complejidad de los PTBs.
    *   Maneja `subscribe`, `deployVault` (creación atómica + transferencia de caps) y `mintMockUSDC`.
*   **Cumplimiento Legal (`ComplianceModal`):**
    *   Bloquea la UI hasta que el usuario acepta los términos "Non-Custodial / Software Provider".
    *   Persistencia local para UX fluida.
*   **Páginas Principales:**
    *   `/dashboard`: Vista de Bóvedas activas y rendimiento.
    *   `/marketplace`: Catálogo de estrategias (Skills) para desplegar.
    *   `/pricing`: Pasarela de pago de suscripciones.
    *   `/studio`: Editor de estrategias (Skills Manifest).
    *   `/analytics`: Gráficos de TVL y rendimiento de la red.

---

## 5. DevOps y Despliegue

Sistema automatizado para gestión de contratos.

*   **`publish.sh`:**
    *   Compila y despliega el paquete Move.
    *   Genera `publish_output.json`.
    *   **Auto-Sync:** Ejecuta automáticamente el script de sincronización.
*   **`scripts/sync-contracts.ts`:**
    *   Lee el output del despliegue.
    *   Extrae los IDs frescos (Package, Registry, AdminCap).
    *   Actualiza `frontend/lib/contracts.json` y `backend/src/config.json`.
*   **`scripts/admin-withdraw.ts`:**
    *   Permite al administrador retirar las ganancias acumuladas en el `SubscriptionRegistry` hacia una Cold Wallet.

---

## Conclusión

La arquitectura actual de Talos v1.0 cumple con los estándares más altos de seguridad DeFi (Atomicidad, Non-Custodial) y ofrece un modelo de negocio SaaS viable y escalable sobre la red Sui.
