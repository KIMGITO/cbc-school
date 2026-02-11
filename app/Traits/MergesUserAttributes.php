<?php

namespace App\Traits;

trait MergesUserAttributes
{
    /**
     * User relation name (default is 'user')
     */
    protected string $userRelation = 'user';

    /**
     * Attributes to merge from user
     * Define this in your model if you want different attributes
     */
    protected array $userAttributesToMerge = ['first_name', 'sir_name', 'other_names', 'email', 'gender'];

    /**
     * Map trait attribute names to actual database column names
     * Example: 'sir_name' => 'last_name' (if your DB has last_name not sir_name)
     */
    protected array $userAttributeMap = [];

    /**
     * Cache for merged attributes
     */
    protected array $mergedAttributes = [];

    /**
     * Override __get to include user attributes
     */
    public function __get($key)
    {
        // Check if it's a user attribute to merge
        if (in_array($key, $this->getUserAttributesToMerge())) {
            return $this->getMergedAttribute($key);
        }

        // Fall back to parent
        return parent::__get($key);
    }

    /**
     * Get merged attribute from user
     */
    protected function getMergedAttribute($key)
    {
        // Check cache first
        if (array_key_exists($key, $this->mergedAttributes)) {
            return $this->mergedAttributes[$key];
        }

        // Get actual database column name
        $dbColumn = $this->userAttributeMap[$key] ?? $key;

        // Try to get from user relation
        $value = $this->getAttributeFromUser($dbColumn);

        // Cache the value
        $this->mergedAttributes[$key] = $value;

        return $value;
    }

    /**
     * Get attribute directly from user relation
     */
    protected function getAttributeFromUser($key)
    {
        // Check if user relation exists
        if (!method_exists($this, $this->userRelation)) {
            return null;
        }

        // Load user if not loaded
        if (!$this->relationLoaded($this->userRelation)) {
            // Try to load, but don't fail if can't
            try {
                $this->load($this->userRelation);
            } catch (\Exception $e) {
                return null;
            }
        }

        // Check if user exists
        if (!$this->{$this->userRelation}) {
            return null;
        }

        // Get the value
        return $this->{$this->userRelation}->{$key} ?? null;
    }

    /**
     * Check if attribute exists (including merged ones)
     */
    public function __isset($key)
    {
        // Check parent first
        if (parent::__isset($key)) {
            return true;
        }

        // Check if it's a user attribute
        if (in_array($key, $this->getUserAttributesToMerge())) {
            return $this->getMergedAttribute($key) !== null;
        }

        return false;
    }

    /**
     * Append user attributes to array/json
     */
    public function toArray()
    {
        $array = parent::toArray();

        // Add merged user attributes
        foreach ($this->getUserAttributesToMerge() as $attribute) {
            if (!array_key_exists($attribute, $array)) {
                $value = $this->getMergedAttribute($attribute);
                if ($value !== null) {
                    $array[$attribute] = $value;
                }
            }
        }

        return $array;
    }

    /**
     * Get user attributes to merge
     */
    protected function getUserAttributesToMerge(): array
    {
        return $this->userAttributesToMerge;
    }

    /**
     * Clear the merged attributes cache
     */
    public function clearMergedCache(): self
    {
        $this->mergedAttributes = [];
        return $this;
    }

    /**
     * Force reload user and refresh cache
     */
    public function reloadUserAttributes(): self
    {
        $this->clearMergedCache();

        if (method_exists($this, $this->userRelation)) {
            $this->load($this->userRelation);
        }

        return $this;
    }

    /**
     * Get all merged data as array
     */
    public function getMergedUserData(): array
    {
        $data = [];

        foreach ($this->getUserAttributesToMerge() as $attribute) {
            $data[$attribute] = $this->getMergedAttribute($attribute);
        }

        return $data;
    }
}
