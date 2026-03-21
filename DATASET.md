# 📦 OULAD Dataset — Description & Reference

> **Open University Learning Analytics Dataset (OULAD)**
> Used to train the PULSE ML engine that classifies learners into 5 behavioural states.

---

## Overview

| Property | Value |
|---|---|
| Source | [Open University Learning Analytics Dataset](https://analyse.kmi.open.ac.uk/open_dataset) |
| Students | ~32,593 unique students |
| Courses (modules) | 22 module-presentation combinations |
| Total VLE interaction rows | ~10.6 million clicks (split across 8 files) |
| Format | CSV (relational — 7 tables) |
| License | CC BY 4.0 |

---

## Files in `/archive/`

| File | Rows | Description |
|---|---|---|
| `studentInfo.csv` | 32,593 | Core student demographics and final results |
| `studentRegistration.csv` | 32,593 | Module registration and unregistration dates |
| `studentAssessment.csv` | 173,912 | Assessment submission scores per student |
| `assessments.csv` | 206 | Assessment metadata (type, due date, weight) |
| `vle.csv` | 6,364 | Virtual Learning Environment activity types |
| `studentVle_0–7.csv` | ~10.5M | Daily click activity per student per VLE site |
| `courses.csv` | 22 | Module presentation lengths |

---

## Table Schemas

### `studentInfo.csv`
The primary table. One row per student-module-presentation enrolment.

| Column | Type | Description |
|---|---|---|
| `code_module` | string | Module identifier (e.g. `AAA`, `BBB`) |
| `code_presentation` | string | Semester code (e.g. `2013J`, `2014B`) |
| `id_student` | int | Unique student ID |
| `gender` | string | `M` or `F` |
| `region` | string | UK region of the student |
| `highest_education` | string | Highest prior qualification |
| `imd_band` | string | Index of Multiple Deprivation band (socioeconomic proxy) |
| `age_band` | string | Age group: `0-35`, `35-55`, `55<=` |
| `num_of_prev_attempts` | int | Number of prior attempts at this module |
| `studied_credits` | int | Total credits studied in this presentation |
| `disability` | string | `Y` or `N` |
| `final_result` | string | **Target label**: `Distinction`, `Pass`, `Fail`, `Withdrawn` |

---

### `studentRegistration.csv`
Tracks when students registered and (optionally) unregistered from a module.

| Column | Type | Description |
|---|---|---|
| `code_module` | string | Module identifier |
| `code_presentation` | string | Semester code |
| `id_student` | int | Student ID |
| `date_registration` | int | Days relative to module start (negative = before start) |
| `date_unregistration` | int / null | Day of withdrawal; null if completed |

---

### `studentAssessment.csv`
One row per student per submitted assessment.

| Column | Type | Description |
|---|---|---|
| `id_assessment` | int | Assessment ID (FK → `assessments.csv`) |
| `id_student` | int | Student ID |
| `date_submitted` | int | Day of submission relative to module start |
| `is_banked` | int | `1` if score carried over from previous attempt |
| `score` | float | Score out of 100 (null if not submitted) |

---

### `assessments.csv`
Metadata for each assessment.

| Column | Type | Description |
|---|---|---|
| `code_module` | string | Module identifier |
| `code_presentation` | string | Semester code |
| `id_assessment` | int | Unique assessment ID |
| `assessment_type` | string | `TMA` (tutor-marked), `CMA` (computer-marked), `Exam` |
| `date` | int | Due date relative to module start |
| `weight` | float | Percentage weight toward final grade |

---

### `vle.csv`
Describes each Virtual Learning Environment activity site.

| Column | Type | Description |
|---|---|---|
| `id_site` | int | Unique VLE site ID |
| `code_module` | string | Module identifier |
| `code_presentation` | string | Semester code |
| `activity_type` | string | Type of resource (e.g. `resource`, `oucontent`, `quiz`, `forumng`) |
| `week_from` | int / null | Week the activity becomes available |
| `week_to` | int / null | Week the activity closes |

---

### `studentVle_0–7.csv` (split)
Daily click interactions — the largest table, split into 8 files (~1.5M rows each).

| Column | Type | Description |
|---|---|---|
| `code_module` | string | Module identifier |
| `code_presentation` | string | Semester code |
| `id_student` | int | Student ID |
| `id_site` | int | VLE site ID (FK → `vle.csv`) |
| `date` | int | Day of interaction relative to module start |
| `sum_click` | int | Number of clicks on that day for that site |

---

### `courses.csv`
Module presentation lengths.

| Column | Type | Description |
|---|---|---|
| `code_module` | string | Module identifier |
| `code_presentation` | string | Semester code |
| `module_presentation_length` | int | Total length of the module in days |

---

## PULSE Label Mapping

The `final_result` column from `studentInfo.csv` is mapped to PULSE behavioural states:

| `final_result` | PULSE State | State ID |
|---|---|---|
| `Distinction` | 🚀 Thriving | 0 |
| `Pass` | 😐 Coasting | 1 |
| `Fail` | 😓 Struggling | 2 |
| `Withdrawn` (late — after day 0) | 🔥 Burning Out | 3 |
| `Withdrawn` (early — before day 0) | 💤 Disengaged | 4 |

---

## Engineered Features (used by PULSE model)

These features are derived from the raw OULAD tables during preprocessing in `PULSE/PULSE_ML_Notebook.ipynb`:

| Feature | Source Table | Description |
|---|---|---|
| `total_clicks` | studentVle | Total VLE clicks across the module |
| `active_days` | studentVle | Number of distinct days with any click activity |
| `avg_clicks_per_day` | studentVle | `total_clicks / active_days` |
| `avg_score` | studentAssessment | Mean score across all submitted assessments |
| `num_assessments` | studentAssessment | Count of assessments submitted |
| `days_to_first_submit` | studentAssessment | Days from module start to first submission |
| `num_of_prev_attempts` | studentInfo | Prior attempts at the same module |
| `studied_credits` | studentInfo | Credits enrolled in this presentation |
| `days_registered_before_start` | studentRegistration | How early the student registered |
| `withdrew_early` | studentRegistration | Binary: withdrew before module day 0 |
| `gender` | studentInfo | Encoded categorical |
| `highest_education` | studentInfo | Encoded categorical |
| `imd_band` | studentInfo | Encoded categorical (socioeconomic) |
| `age_band` | studentInfo | Encoded categorical |
| `disability` | studentInfo | Encoded categorical |

---

## Entity Relationship

```
courses ──────────────────────────────────────────────┐
                                                       │
studentInfo ──── studentRegistration                   │
     │                                                 │
     ├──── studentAssessment ──── assessments ─────────┤
     │                                                 │
     └──── studentVle ──────────── vle ────────────────┘
                    (joined on code_module + code_presentation)
```

---

## References

- Kuzilek, J., Hlosta, M., & Zdrahal, Z. (2017). *Open University Learning Analytics Dataset*. Scientific Data, 4, 170171. https://doi.org/10.1038/sdata.2017.171
- Dataset portal: https://analyse.kmi.open.ac.uk/open_dataset
